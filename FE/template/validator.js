function Validator(formSelector, options){
    //gan gia tri mac dinh cho tham so ES5
    if (!options){
        options={};
    }

    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element=element.parentElement;
        }
    }
    var formRules = {};

    //Quy uoc tao rule:
    //neu co loi thi return error message
    //neu khong co loi thi return undefined

    var validatorRules = {
        required: function (value){
            return value ? undefined:'Vui lòng nhập trường này';
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined: 'Vui lòng nhập email';
        },
        min: function (min){
            return function(value){
                return value.length >= min ? undefined:`Vui lòng nhập ít nhất ${min} kí tự`;
            }
        },
    };

    //lay ra form element trong DOM theo formSelector
    var formElement = document.querySelector(formSelector);
    if(formElement){
        var inputs = formElement.querySelectorAll('[name][rules]');
        for(var input of inputs){
            var rules = input.getAttribute('rules').split('|');
            for (var rule of rules){
                var ruleInfo;
                var isRuleHasValue = rule.includes(':');
                if(rule.includes(':')){
                    ruleInfo = rule.split(':');
                    rule=ruleInfo[0];
                }
                var ruleFunc=validatorRules[rule];
                if(isRuleHasValue){
                    ruleFunc=ruleFunc(ruleInfo[1]);
                }
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc);
                }else{
                    formRules[input.name]=[ruleFunc];
                }
            }
            //Lang nghe su kien de validate (blur, change)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }

        
        function handleValidate(event){
            var rules = formRules[event.target.name];
            var errorMessage;
            rules.find(function(rule){
                errorMessage = rule(event.target.value);
                return errorMessage;
            });
            //neu co loi thi hien thi message loi ra UI
            //console.log(errorMessage);
            if(errorMessage){
                var formGroup = getParent(event.target,'.form-group');
                if(formGroup){
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage){
                        formMessage.innerText = errorMessage;
                    }
                }
            }
            return !errorMessage;
        }

        //ham clear message loi
        function handleClearError(event){
            var formGroup = getParent(event.target,'.form-group');
            if(formGroup){
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                if(formMessage){
                    formMessage.innerText = '';
                }
            }
        }
    }


    //xu li hanh vi submit form
    formElement.onsubmit = function(event){
        event.preventDefault();
        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;
        for(var input of inputs){
            if(!handleValidate({ target: input })){
                isValid=false;
            }
        }
        this.onSubmit=function(){

        };

        //khi khong co loi thi submit form
        if(isValid){
            if(typeof options.onSubmit ==='function'){
                //goi lai ham onSubmit va tra ve gia tri cua form
                var enableInputs = formElement.querySelectorAll('[name]:not([disable])');
                    var formValues = Array.from(enableInputs).reduce(function(values,input){
                        switch (input.type) {
                            case 'radio':
                                values[input.name]=formElement.querySelector('input[name="'+input.name+'"]:checked').value;
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    values[input.name]=[];
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])){
                                    values[input.name]=[];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name]=input.files;
                                break;
                            default:
                                values[input.name]=input.value;
                                break;
                        }
                        return values;
                    },{});
                    options.onSubmit(formValues);
            } else {
                formElement.submit();
            }
        }
    }
}