const BASE_URL = "https://api.trello.com/1";
const AUTH = `key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;

async function trelloRequest(method, path, body = null) {
  const url = `${BASE_URL}${path}${path.includes("?") ? "&" : "?"}${AUTH}`;
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Trello API error ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Workspaces (Organizations) ───────────────────────────────────────────────

async function getWorkspaces() {
  return trelloRequest("GET", "/members/me/organizations?fields=id,displayName,name,url");
}

// ── Boards ──────────────────────────────────────────────────────────────────

async function getBoards() {
  return trelloRequest("GET", "/members/me/boards?fields=id,name,url,idOrganization&filter=open");
}

async function getBoardsFull() {
  return trelloRequest("GET", "/members/me/boards?fields=id,name,url,idOrganization&filter=open&lists=all&list_fields=id,name,pos&customFields=true");
}

async function getBoard(boardId) {
  return trelloRequest("GET", `/boards/${boardId}?fields=id,name,url,desc`);
}

// ── Lists ────────────────────────────────────────────────────────────────────

async function getLists(boardId) {
  return trelloRequest("GET", `/boards/${boardId}/lists?fields=id,name,pos`);
}

async function createList(boardId, name) {
  return trelloRequest("POST", `/lists?name=${encodeURIComponent(name)}&idBoard=${boardId}`);
}

// ── Cards ────────────────────────────────────────────────────────────────────

async function getCards(listId) {
  return trelloRequest("GET", `/lists/${listId}/cards?fields=id,name,desc,due,dueComplete,start,dueReminder,url,idList,idMembers,labels&members=true&member_fields=id,username,fullName&checklists=all&checklist_fields=id,name,pos&checkItems=all&checkItem_fields=id,name,state&customFieldItems=true`);
}

async function getBoardCards(boardId) {
  return trelloRequest("GET", `/boards/${boardId}/cards?fields=id,name,desc,due,dueComplete,start,dueReminder,url,idList,idMembers,labels&members=true&member_fields=id,username,fullName&checklists=all&checklist_fields=id,name,pos&checkItems=all&checkItem_fields=id,name,state&customFieldItems=true`);
}

async function getCard(cardId) {
  return trelloRequest("GET", `/cards/${cardId}?fields=id,name,desc,due,url,idList`);
}

async function createCard(listId, name, desc = "", due = null, start = null, dueReminder = -1) {
  const params = new URLSearchParams({ idList: listId, name });
  if (desc)  params.append("desc", desc);
  if (due)   params.append("due", due);
  if (start) params.append("start", start);
  if (dueReminder != null && dueReminder !== -1) params.append("dueReminder", dueReminder);
  return trelloRequest("POST", `/cards?${params}`);
}

async function updateCard(cardId, fields) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(fields)) {
    params.append(k, v === null ? "" : v);
  }
  return trelloRequest("PUT", `/cards/${cardId}?${params}`);
}

async function moveCard(cardId, listId) {
  return trelloRequest("PUT", `/cards/${cardId}?idList=${listId}`);
}

async function deleteCard(cardId) {
  return trelloRequest("DELETE", `/cards/${cardId}`);
}

// ── Checklists ────────────────────────────────────────────────────────────────

async function getCardChecklists(cardId) {
  return trelloRequest("GET", `/cards/${cardId}/checklists?fields=id,name,pos&checkItems=all&checkItem_fields=id,name,state,pos`);
}

async function addChecklist(cardId, name) {
  return trelloRequest("POST", `/cards/${cardId}/checklists?name=${encodeURIComponent(name)}`);
}

async function addCheckItem(checklistId, name) {
  return trelloRequest("POST", `/checklists/${checklistId}/checkItems?name=${encodeURIComponent(name)}`);
}

async function updateCheckItem(cardId, checklistId, checkItemId, state) {
  return trelloRequest("PUT", `/cards/${cardId}/checkItem/${checkItemId}?state=${state}&idChecklist=${checklistId}`);
}

async function deleteCheckItem(checklistId, checkItemId) {
  return trelloRequest("DELETE", `/checklists/${checklistId}/checkItems/${checkItemId}`);
}

async function deleteChecklist(checklistId) {
  return trelloRequest("DELETE", `/checklists/${checklistId}`);
}

// ── Labels ───────────────────────────────────────────────────────────────────

async function getLabels(boardId) {
  return trelloRequest("GET", `/boards/${boardId}/labels`);
}

async function addLabelToCard(cardId, labelId) {
  return trelloRequest("POST", `/cards/${cardId}/idLabels?value=${labelId}`);
}

// ── Members ───────────────────────────────────────────────────────────────────

async function getBoardMembers(boardId) {
  return trelloRequest("GET", `/boards/${boardId}/members?fields=id,fullName,username`);
}

// ── Custom Fields (P7-1 B5) ───────────────────────────────────────────────────

async function getBoardCustomFields(boardId) {
  return trelloRequest("GET", `/boards/${boardId}/customFields`);
}

// ── Comments ──────────────────────────────────────────────────────────────────

async function addComment(cardId, text) {
  return trelloRequest("POST", `/cards/${cardId}/actions/comments?text=${encodeURIComponent(text)}`);
}

async function getComments(cardId) {
  return trelloRequest("GET", `/cards/${cardId}/actions?filter=commentCard`);
}

module.exports = {
  getWorkspaces,
  getBoards, getBoardsFull, getBoard,
  getLists, createList,
  getCards, getBoardCards, getCard, createCard, updateCard, moveCard, deleteCard,
  getCardChecklists, addChecklist, addCheckItem, updateCheckItem, deleteCheckItem, deleteChecklist,
  getLabels, addLabelToCard,
  getBoardMembers, getBoardCustomFields,
  addComment, getComments,
};
