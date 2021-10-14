'use strict';

const sendMsgWrap = document.querySelector('.send-msg'),
    workBtn = document.querySelector('.work__button'),
    bg = document.querySelector('.popup__bg'),
    closeBtn = document.querySelector('.close');

const sendMsgForm = document.querySelector('.send-msg__form'),
        sendMsgBtn = document.querySelector('.send-msg__btn'),
        sendMsgFields = document.querySelectorAll('.send-msg__form input[type="text"]'),
        sendMsgText = document.querySelector('.send-msg__msg');

        sendMsgForm.addEventListener('submit', (e) => e.preventDefault());

class Popup {
    constructor(popup, bg, btn) {
        this.popup = popup;
        this.bg = bg;
        this.btn = btn;
        this.show.bind(this);
    }

    show() {
        this.popup.classList.add('active');
        this.bg.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.popup.classList.remove('active');
        this.bg.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

}

class FormSend{
    constructor(form, submit, fields, text) {
        this.form = form;
        this.submit = submit;
        this.fieldset = fields;
        this.text = text;

        this.form.addEventListener('submit', (e)=>{
            e.preventDefault();
        });
    }
}

let sendMsgPopup = new Popup(sendMsgWrap, bg, workBtn);

workBtn.addEventListener('click', sendMsgPopup.show.bind(sendMsgPopup));
bg.addEventListener('click', sendMsgPopup.close.bind(sendMsgPopup));
closeBtn.addEventListener('click', sendMsgPopup.close.bind(sendMsgPopup));

let sendMsg = new FormSend(sendMsgForm, sendMsgBtn, sendMsgFields, sendMsgText);