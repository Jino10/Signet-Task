/* eslint-disable no-console */
import { fetchCall } from '../../Services/APIService';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { apiMethods, httpStatusCode } from '../../Constants/TextConstants';
import { messageService } from '../../Services/MessageService';

export async function updateFCRestoreId(restoreId) {
  const urlencoded = new URLSearchParams();
  urlencoded.append('userId', localStorage.getItem('id'));
  urlencoded.append('freshchatRestoreId', restoreId);
  const { 0: statusCode } = await fetchCall(`${APIUrlConstants.UPDATE_RESTORE_ID_API}`, apiMethods.POST, urlencoded);
  if (statusCode === httpStatusCode.SUCCESS) {
    console.log('Restore Id updated successfully');
  }
}

export function initFCWidget() {
  const externalId = localStorage.getItem('id');
  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');
  const email = localStorage.getItem('email');
  const restoreId = localStorage.getItem('fc_restoreId');
  const mobile = localStorage.getItem('mobile');

  /* Signet configuration */
  window.fcWidget.init({
    token: process.env.REACT_APP_FRESHCHAT_TOKEN,
    host: 'https://wchat.freshchat.com',
    config: {
      cssNames: {
        widget: 'fc_frame',
        open: 'fc_open',
        expanded: 'fc_expanded',
      },
      disableEvents: false,
      fullscreen: true,
      showFAQOnOpen: true,
      hideFAQ: true,
      headerProperty: {
        appName: 'Signet Remote Smart',
        backgroundColor: '#2A6EBB',
        direction: 'rtl',
        fontName: 'Poppins',
        foregroundColor: '#FFF',
        hideChatButton: true,
      },
    },
    externalId,
    firstName,
    lastName,
    email,
    phone: mobile,
    restoreId: restoreId || null,
    open: false,
  });

  window.fcWidget.user.setProperties({
    plan: 'Pro',
    status: 'Active',
  });
  window.fcWidget.on('widget:opened', () => {});

  window.fcWidget.on('widget:loaded', () => {});

  window.fcWidget.on('widget:closed', () => {
    messageService.sendMessage(true);
  });
  window.fcWidget.user.get(() => {});

  window.fcWidget.on('user:created', (resp) => {
    const status = resp && resp.status;
    const data = resp && resp.data;
    if (status === httpStatusCode.SUCCESS) {
      if (data.restoreId) {
        updateFCRestoreId(data.restoreId).then(() => localStorage.setItem('fc_restoreId', data.restoreId));
      }
    }
  });
}

export async function showfcWidget() {
  if (window.fcWidget.isOpen() !== true) {
    window.fcWidget.show();
    window.fcWidget.open();
  } else {
    window.fcWidget.show();
  }
}

export async function hidefcWidget() {
  window.fcWidget.hide();
}

export async function getFCRestoreId() {
  const response = await fetch(`${APIUrlConstants.GET_FC_RESTORE_ID_API}/${localStorage.getItem('id')}`);
  const responseData = await response.json();
  if (response.status === httpStatusCode.SUCCESS) {
    localStorage.setItem('fc_restoreId', responseData.data.restoreId);
  }
}

export async function preSetupFCWidget(show) {
  if (!window.fcWidget.isInitialized()) {
    initFCWidget();
  }
  if (show) {
    showfcWidget().then();
  }
}
