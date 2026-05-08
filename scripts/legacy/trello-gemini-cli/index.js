require("dotenv").config();
const readline = require("readline");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const trello = require("../../../trello");
const tools = require("./tools");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Convert Anthropic-style tools → Gemini functionDeclarations ──────────────

const functionDeclarations = tools.map((t) => ({
  name: t.name,
  description: t.description,
  parameters: t.input_schema,
}));

// ── Tool executor ─────────────────────────────────────────────────────────────

async function executeTool(name, input) {
  switch (name) {
    case "get_boards":         return trello.getBoards();
    case "get_lists":          return trello.getLists(input.board_id);
    case "create_list":        return trello.createList(input.board_id, input.name);
    case "get_cards":          return trello.getCards(input.list_id);
    case "get_card":           return trello.getCard(input.card_id);
    case "create_card":        return trello.createCard(input.list_id, input.name, input.desc, input.due);
    case "update_card": {
      const { card_id, ...fields } = input;
      return trello.updateCard(card_id, fields);
    }
    case "move_card":          return trello.moveCard(input.card_id, input.list_id);
    case "delete_card":        return trello.deleteCard(input.card_id);
    case "get_labels":         return trello.getLabels(input.board_id);
    case "add_label_to_card":  return trello.addLabelToCard(input.card_id, input.label_id);
    case "get_board_members":  return trello.getBoardMembers(input.board_id);
    case "add_comment":        return trello.addComment(input.card_id, input.text);
    case "get_comments":       return trello.getComments(input.card_id);
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

// ── Gemini agent loop ─────────────────────────────────────────────────────────

const SYSTEM = `คุณคือ Trello Assistant ที่ช่วยจัดการงานผ่าน Trello API
คุณสามารถดู สร้าง แก้ไข ย้าย และลบ boards/lists/cards ได้
ตอบเป็นภาษาไทยเสมอ และสรุปสิ่งที่ทำให้ผู้ใช้รับทราบหลังจากดำเนินการเสร็จ
เมื่อต้องการข้อมูล เช่น board_id หรือ list_id ให้ดึงข้อมูลก่อนเสมอหากผู้ใช้ไม่ได้ระบุมา`;

async function runAgent(userMessage, history) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
    systemInstruction: SYSTEM,
    tools: [{ functionDeclarations }],
  });

  const chat = model.startChat({ history });

  let result = await chat.sendMessage(userMessage);

  while (true) {
    const response = result.response;
    const parts = response.candidates[0].content.parts;

    const toolCalls = parts.filter((p) => p.functionCall);
    if (toolCalls.length === 0) {
      const text = parts.map((p) => p.text || "").join("");
      const updatedHistory = await chat.getHistory();
      return { reply: text, history: updatedHistory };
    }

    const functionResponses = [];
    for (const part of toolCalls) {
      const { name, args } = part.functionCall;
      process.stdout.write(`  [tool] ${name}(${JSON.stringify(args)})\n`);

      let response;
      try {
        response = await executeTool(name, args);
      } catch (err) {
        response = { error: err.message };
      }

      functionResponses.push({
        functionResponse: {
          name,
          response: { result: response },
        },
      });
    }

    result = await chat.sendMessage(functionResponses);
  }
}

// ── CLI loop ──────────────────────────────────────────────────────────────────

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("🤖 Trello Bot พร้อมใช้งานแล้ว! (พิมพ์ 'exit' เพื่อออก)\n");

  let history = [];

  const ask = () => {
    rl.question("คุณ: ", async (input) => {
      const msg = input.trim();
      if (!msg) return ask();
      if (msg.toLowerCase() === "exit") {
        console.log("ลาก่อน!");
        rl.close();
        return;
      }

      try {
        const result = await runAgent(msg, history);
        history = result.history;
        console.log(`\nBot: ${result.reply}\n`);
      } catch (err) {
        console.error(`\nError: ${err.message}\n`);
      }

      ask();
    });
  };

  ask();
}

main();
