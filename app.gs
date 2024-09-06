const bienSoXeList = [
  {
    bienso: 'BIEN_SO_XE', // VÍ DỤ: 77F111111
  },
]

function sendMessageToTelegram(message, botToken = 'BOT_TOKEN') {
  var chatId = 'CHAT_ID';
  
  var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage';
  
  var payload = {
    chat_id: chatId,
    text: message,
    parse_mode: "Markdown"
  };
  
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(url, options);
}

function createMessage(violation) {
  return violation.map(item => Object.keys(item).map(key => `*${key.replace(/([_*[\]()~`>#+-=|{}.!])/g, '\\$1')}*: ${Array.isArray(item[key]) ? item[key].join('\n') : item[key]}`).join('\n')).join('\n\n');
}

function fetchData(bienSoXe) {
  var url = 'https://api.checkphatnguoi.vn/phatnguoi'

  var payload = Object.keys(bienSoXe).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(bienSoXe[key]);
  }).join('&');

  var options = {
    'method': 'post',
    'contentType': 'application/x-www-form-urlencoded',
    'payload': payload
  };

  try {
    var response = UrlFetchApp.fetch(url, options);

    const data = JSON.parse(response).data;

    if (data) {
      sendMessageToTelegram(createMessage(data))
    }
  } catch (error) {
    sendMessageToTelegram(`BSX ${bienSoXe.bienso}: ${error.message}`);
  }
}

function run() {
  bienSoXeList.forEach(fetchData);
}

function fetchDataWeekly(bienSoXe) {
  var url = 'https://api.checkphatnguoi.vn/phatnguoi'

  var payload = Object.keys(bienSoXe).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(bienSoXe[key]);
  }).join('&');

  var options = {
    'method': 'post',
    'contentType': 'application/x-www-form-urlencoded',
    'payload': payload
  };

  try {
    var response = UrlFetchApp.fetch(url, options);

    const data = JSON.parse(response).data;

    if (data) {
      sendMessageToTelegram(JSON.stringify(data))
    }
  } catch (error) {
    sendMessageToTelegram(`BSX ${bienSoXe.bienso}: ${error.message}`);
  }
}

function runWeekly() {
  bienSoXeList.forEach(fetchDataWeekly);
}
