const tools = [
  {
    name: "get_boards",
    description: "ดึงรายการ Trello boards ทั้งหมดของผู้ใช้",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_lists",
    description: "ดึงรายการ lists ทั้งหมดในบอร์ดที่ระบุ",
    input_schema: {
      type: "object",
      properties: {
        board_id: { type: "string", description: "ID ของ Trello board" },
      },
      required: ["board_id"],
    },
  },
  {
    name: "create_list",
    description: "สร้าง list ใหม่ในบอร์ดที่ระบุ",
    input_schema: {
      type: "object",
      properties: {
        board_id: { type: "string", description: "ID ของ Trello board" },
        name: { type: "string", description: "ชื่อของ list ใหม่" },
      },
      required: ["board_id", "name"],
    },
  },
  {
    name: "get_cards",
    description: "ดึงรายการ cards ทั้งหมดใน list ที่ระบุ",
    input_schema: {
      type: "object",
      properties: {
        list_id: { type: "string", description: "ID ของ list" },
      },
      required: ["list_id"],
    },
  },
  {
    name: "get_card",
    description: "ดึงรายละเอียดของ card ที่ระบุ",
    input_schema: {
      type: "object",
      properties: {
        card_id: { type: "string", description: "ID ของ card" },
      },
      required: ["card_id"],
    },
  },
  {
    name: "create_card",
    description: "สร้าง card ใหม่ใน list ที่ระบุ",
    input_schema: {
      type: "object",
      properties: {
        list_id: { type: "string", description: "ID ของ list ที่จะสร้าง card" },
        name: { type: "string", description: "ชื่อของ card" },
        desc: { type: "string", description: "รายละเอียดของ card (optional)" },
        due: { type: "string", description: "วันครบกำหนดในรูปแบบ ISO 8601 เช่น 2026-05-01T12:00:00.000Z (optional)" },
      },
      required: ["list_id", "name"],
    },
  },
  {
    name: "update_card",
    description: "แก้ไขข้อมูล card เช่น ชื่อ คำอธิบาย หรือวันครบกำหนด",
    input_schema: {
      type: "object",
      properties: {
        card_id: { type: "string", description: "ID ของ card" },
        name: { type: "string", description: "ชื่อใหม่ (optional)" },
        desc: { type: "string", description: "คำอธิบายใหม่ (optional)" },
        due: { type: "string", description: "วันครบกำหนดใหม่ ISO 8601 (optional)" },
        dueComplete: { type: "boolean", description: "ทำเครื่องหมายว่าเสร็จแล้ว (optional)" },
      },
      required: ["card_id"],
    },
  },
  {
    name: "move_card",
    description: "ย้าย card ไปยัง list อื่น",
    input_schema: {
      type: "object",
      properties: {
        card_id: { type: "string", description: "ID ของ card" },
        list_id: { type: "string", description: "ID ของ list ปลายทาง" },
      },
      required: ["card_id", "list_id"],
    },
  },
  {
    name: "delete_card",
    description: "ลบ card ที่ระบุออกจาก Trello",
    input_schema: {
      type: "object",
      properties: {
        card_id: { type: "string", description: "ID ของ card ที่ต้องการลบ" },
      },
      required: ["card_id"],
    },
  },
  {
    name: "get_labels",
    description: "ดึงรายการ labels ทั้งหมดในบอร์ดที่ระบุ",
    input_schema: {
      type: "object",
      properties: {
        board_id: { type: "string", description: "ID ของ Trello board" },
      },
      required: ["board_id"],
    },
  },
  {
    name: "add_label_to_card",
    description: "เพิ่ม label ให้กับ card",
    input_schema: {
      type: "object",
      properties: {
        card_id: { type: "string", description: "ID ของ card" },
        label_id: { type: "string", description: "ID ของ label" },
      },
      required: ["card_id", "label_id"],
    },
  },
  {
    name: "get_board_members",
    description: "ดึงรายชื่อ members ในบอร์ดที่ระบุ",
    input_schema: {
      type: "object",
      properties: {
        board_id: { type: "string", description: "ID ของ Trello board" },
      },
      required: ["board_id"],
    },
  },
  {
    name: "add_comment",
    description: "เพิ่ม comment ใน card ที่ระบุ",
    input_schema: {
      type: "object",
      properties: {
        card_id: { type: "string", description: "ID ของ card" },
        text: { type: "string", description: "ข้อความ comment" },
      },
      required: ["card_id", "text"],
    },
  },
  {
    name: "get_comments",
    description: "ดึง comments ทั้งหมดใน card ที่ระบุ",
    input_schema: {
      type: "object",
      properties: {
        card_id: { type: "string", description: "ID ของ card" },
      },
      required: ["card_id"],
    },
  },
];

module.exports = tools;
