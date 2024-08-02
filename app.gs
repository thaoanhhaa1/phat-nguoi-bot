const bienSoXeList = [{
    'type': '1',
    'loaixe': '2', // 1 với oto, 2 là xe máy
    bsx: '', // Biển số xe, ví dụ: 77F112345
    bien: 'T'
}]

function sendMessageToTelegram(message, botToken = '<YOUR BOT TOKEN>') {
  var chatId = '<YOUR CHAT ID>';
  
  var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage';
  
  var payload = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML"
  };
  
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(url, options);
}

function createMessage(violation) {
  const [location, address, phone] = violation.noi_giai_quyet_vu_viec.trim().split(/[\\]n/g).filter(Boolean);

  return `
<b>Biển kiểm sát:</b> ${violation.bien_kiem_sat}
<b>Hành vi vi phạm:</b> ${violation.hanh_vi_vi_pham}
<b>Địa điểm vi phạm:</b> ${violation.dia_diem_vi_pham}
<b>Mức phạt:</b> ${violation.muc_phat}
<b>Nơi giải quyết:</b> ${location}
                       ${address}
                       ${phone}
<b>Thời gian vi phạm:</b> ${violation.thoi_gian_vi_pham}
<b>Trạng thái:</b> ${violation.trang_thai}
`;
}

function fetchData(bienSoXe) {
  var url = 'https://phatnguoi.com/action.php';

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

    const data = JSON.parse(response.getContentText());
    const violations = data.violations

    if (!violations?.length) return;

    violations.forEach(item => sendMessageToTelegram(createMessage(item)));
  } catch (error) {
    sendMessageToTelegram(`BSX ${bienSoXe.bsx}: ${error.message}`);
  }
}

function run() {
  bienSoXeList.forEach(fetchData);
}
