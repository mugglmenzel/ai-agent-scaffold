/* eslint-disable no-undef */

const chatHistory = [];

const addAIChatMessage = (message) =>{
  chatHistory.push({
    'role': 'ai',
    'message': message,
  });
  message = marked.parse(message);
  const messageTemplate = `
<div class="mdc-layout-grid__inner">
    <div class="mdc-layout-grid__cell  mdc-layout-grid__cell--span-6">
        <div class="mdc-card mdc-card--outlined 
                    mdc-chat-bubble mdc-chat-bubble--ai mdc-elevation--z2">
            <div class="mdc-typography mdc-typography--body2">${message}</div>
        </div>
    </div>
    <div class="mdc-layout-grid__cell  mdc-layout-grid__cell--span-6"></div>
</div>`;
  $('#chat-grid').append(messageTemplate);
};

const addUserChatMessage = (message) =>{
  chatHistory.push({
    'role': 'user',
    'message': message,
  });
  message = marked.parse(message);
  const messageTemplate = `
<div class="mdc-layout-grid__inner">
    <div class="mdc-layout-grid__cell  mdc-layout-grid__cell--span-6"></div>
    <div class="mdc-layout-grid__cell  mdc-layout-grid__cell--span-6">
        <div class="mdc-card mdc-card--outlined 
                    mdc-chat-bubble mdc-chat-bubble--user mdc-elevation--z2">
            <div class="mdc-typography mdc-typography--body2">${message}</div>
        </div>
    </div>
</div>`;
  $('#chat-grid').append(messageTemplate);
};

const chatStatusIndicator = (status = 'ready') =>{
  if (status == 'process') {
    $('#chat-status-icon').html('autorenew');
    $('#chat-status-icon').addClass('material-icons--rotate');
  } else if (status == 'ready') {
    $('#chat-status-icon').html('chat');
    $('#chat-status-icon').removeClass('material-icons--rotate');
  }
};

const handleMessageSend = (e) =>{
  $('#chat-image-input').prop('files')[0].convertToBase64((imageBase64) =>{
    message = $('#chat-message-input').val();
    chatStatusIndicator('process');
    addUserChatMessage(message);

    $.ajax({
      url: '/chat', type: 'POST',
      data: JSON.stringify({
        message: message,
        image: imageBase64,
        history: chatHistory,
      }),
      processData: false,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: (res) =>{
        addAIChatMessage(res['message']);
        chatStatusIndicator('ready');
        $('#chat-message-input').val('');
      },
    });
  });
};

const handleImageUpload = (e) =>{
  $('#chat-image-input').click();
};

File.prototype.convertToBase64 = (callback) =>{
  const reader = new FileReader();
  reader.onloadend = (e) =>{
    callback(e.target.result, e.target.error);
  };
  reader.readAsDataURL(this);
};

const registerListeners = () =>{
  $('#chat-message-send').click(handleMessageSend);
  $('#chat-message-input').keypress((e) =>{
    if (e.key === 'Enter') {
      handleMessageSend(e);
    }
  });
  $('#chat-message-upload').click(handleImageUpload);
};

$(document).ready(() =>{
  registerListeners();
});

