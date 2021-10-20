'use strict';

const sendMsgWrap = document.querySelector('.send-msg'),
    workBtn = document.querySelector('.work__button'),
    bg = document.querySelector('.popup__bg'),
    closeBtn = document.querySelector('.close');

const sendMsgForm = document.querySelector('.send-msg__form'),
        sendMsgBtn = document.querySelector('.send-msg__btn'),
        sendMsgFields = document.querySelectorAll('.send-msg__form input[type="text"]'),
        sendMsgText = document.querySelector('.send-msg__msg'),
        successPopup = document.querySelector('.success-popup'),
        successPopupOkBtn = document.querySelector('.success-popup__btn');

    //  Class for popup windows
    //
    //  popup - wrapper for popup or popup itsef,
    //  bg    - background for popup,
    //  btn   - submit button for form

class Popup {
    constructor(popup, bg, btn) {
        this.popup = popup;
        this.bg = bg;
        this.btn = btn;
        this.show.bind(this);
    }

    // Show popup and background
    // Block scroll
    show() {
        this.popup.classList.add('active');
        this.bg.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close popup and background
    // Removing old alerts and error styles
    close() {
        sendMsgForm.reset();
        const errMsg = document.querySelector('._err');
        if(errMsg) {
            errMsg.remove();
        }
        
        const sucMsg = document.querySelector('._success');
        if(sucMsg) {
            sucMsg.remove();
        }

        sendMsgText.classList.remove('_req');
            for(let i = 0; i < sendMsgFields.length; i++) {
                sendMsgFields[i].classList.remove('_req');
            }
        this.popup.classList.remove('active');
        this.bg.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

}


class PopupSuccess extends Popup {
    constructor (popup, bg, btn) {
        super(popup, bg, btn);

        this.btn.addEventListener('click', super.close.bind(this));
    }
}


    //  Class for sending form
    //
    //  form   - form for sending,
    //  submit - submit button for form,
    //  fields - input fields of form NodeList (text, name, telephone, etc.)
    //  text   - text from textarea of form

class FormSend{
    constructor(form, submit, fields, text) {
        this.form = form;
        this.submit = submit;
        this.fields = fields;
        this.text = text;

        this.form.addEventListener('submit', (e)=>{
            e.preventDefault();
            const validateForm = new FormValidate(this.fields, this.text);
            if (validateForm.validate()) {
                this.send();
                sendMsgPopup.close();
                setTimeout(()=> {successMsg.show()}, 500);

            }
        })
    }




        // Success alert if fields filled and message sent
        success() {
            const successAlert = document.createElement('div');
            successAlert.classList.add('_success');
            successAlert.innerHTML = "Your message has been sent successfully!";
            this.form.append(successAlert);
        }



        //Sending form fields in json format to backend
        // Calling success if server response "ok"
        async send() {

            let data = {};

            for (let i = 0; i < this.fields.length; i++) {
                const element = this.fields[i];
    
                data[element.id] = element.value;
            }

            data[this.text.id] = this.text.value;

       
            let response = await fetch('send-mail.php', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                this.success();
                this.form.reset();
            } 
        }
    }

    class FormValidate {
        constructor(fields, text) {
            this.fields = fields;
            this.text = text;
        }

        validate(fields, text) {

            const oldErr = document.querySelector('._err');
            if(oldErr) {
                oldErr.remove();
            }

            const oldSucc = document.querySelector('._success');
            if(oldSucc) {
                oldSucc.remove();
            }

            this.text.classList.remove('_req');
            for(let i = 0; i < this.fields.length; i++) {
                this.fields[i].classList.remove('_req');
            }
            
            let errType = '';

            for(let i=0; i<this.fields.length; i++) {
                if(this.fields[i].value.trim() === "") {
                    this.fields[i].classList.add('_req');
                    errType = 'fieldsErr';
                }
                if(this.fields[i].id === "email") {
                   
                    if(!this.validateEmail(this.fields[i].value)) {
                        this.fields[i].classList.add('_req');
                        errType = 'emailErr';
                    }
                }
            }

            if(this.text.value.trim() === "") {
                this.text.classList.add('_req');
                errType = 'fieldsErr';
            }

            if(errType) {
                if(errType === 'fieldsErr') {
                    this.err('fieldsErr');
                } else if(errType === 'emailErr') {
                    this.err('emailErr');
                }
                return false;
            } else {
                return true;
            }
            
        }

        
        // Error alert if form has empty fields
        err(errType) {

            if(errType === 'emailErr') {
                const errAlert = document.createElement('div');
                errAlert.classList.add('_err');
                errAlert.innerHTML = "Please enter valid Email";
                sendMsgForm.append(errAlert);

            } else if(errType === 'fieldsErr') {

                const errAlert = document.createElement('div');
                errAlert.classList.add('_err');
                errAlert.innerHTML = "Please fill in all the required fields.";
                sendMsgForm.append(errAlert);
            }

        }

        validateEmail(email) {
            var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return re.test(email);
        }

     
    }




const sendMsgPopup = new Popup(sendMsgWrap, bg, workBtn);

    //Open Send Us Message Popup on "Let's talk" button
workBtn.addEventListener('click', sendMsgPopup.show.bind(sendMsgPopup));

    //Close Send Us Message Popup on close-x button or its background
bg.addEventListener('click', function(e) {
    if(e.target.classList.contains("send-msg") || e.target.classList.contains("success-popup")){
        sendMsgPopup.close();
        successMsg.close();
    }
    
});
closeBtn.addEventListener('click', sendMsgPopup.close.bind(sendMsgPopup));

    //Validate form before sending

const sendMsg = new FormSend(sendMsgForm, sendMsgBtn, sendMsgFields, sendMsgText);

const successMsg = new PopupSuccess(successPopup, bg, successPopupOkBtn)


