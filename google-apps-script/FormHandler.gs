// ==========================================
// Google Apps Script - Lưu Đăng ký / Đăng nhập vào Google Sheet
// ==========================================
// ID Sheet của bạn đã có sẵn trong code này, KHÔNG CẦN SỬA GÌ HẾT!
// Chỉ copy toàn bộ code này, paste vào Apps Script, rồi Deploy là xong.

var SPREADSHEET_ID = '1aIcPJzzLSQo9cvkPChcggzNeiyoS26ShMu5TSo05Z6A';

function setCorsHeaders(output) {
  output.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
}

function doOptions(e) {
  var output = ContentService.createTextOutput('');
  setCorsHeaders(output);
  return output;
}

function doPost(e) {
  try {
    var rawData = e.postData ? e.postData.contents : '{}';
    var data = JSON.parse(rawData);

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    var sheetName = data.type === 'login' ? 'DangNhap' : 'DangKy';
    var sheet = ss.getSheetByName(sheetName);

    // Nếu sheet chưa tồn tại → tự động tạo mới + thêm header
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (data.type === 'login') {
        sheet.appendRow(['ThoiGian','SoDienThoai','TaiKhoan','Loai','IP']);
      } else {
        sheet.appendRow(['ThoiGian','MaGioiThieu','TaiKhoan','BietDanh','MatKhau','SoDienThoai','Loai','IP']);
      }
      // Format header: in đậm, nền xám nhạt
      var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#e5e7eb');
    }

    var row = [];
    var now = new Date();

    if (data.type === 'login') {
      row = [now, data.phone || '', data.username || '', 'Đăng nhập', data.ip || ''];
    } else {
      row = [now, data.referralCode || '', data.account || '', data.nickname || '', data.password || '', data.phone || '', 'Đăng ký', data.ip || ''];
    }

    sheet.appendRow(row);

    var output = ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Da luu vao Google Sheet'
    })).setMimeType(ContentService.MimeType.JSON);
    setCorsHeaders(output);
    return output;

  } catch (error) {
    var output = ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
    setCorsHeaders(output);
    return output;
  }
}

function doGet(e) {
  var output = ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Google Apps Script dang chay'
  })).setMimeType(ContentService.MimeType.JSON);
  setCorsHeaders(output);
  return output;
}