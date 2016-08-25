'use strict';

angularApp.controller('CreateCtrl', function ($scope, $dialog,FormService) {

    // preview form mode
    $scope.previewMode = false;

    // new form
    $scope.form = {};
    $scope.form.form_id = 1;
    $scope.form.url = '';
    $scope.form.barnch = "";
    $scope.form.form_name = 'My Form';
    $scope.form.form_fields = [];

    // previewForm - for preview purposes, form will be copied into this
    // otherwise, actual form might get manipulated in preview mode
    $scope.previewForm = {};

    // add new field drop-down:
    $scope.addField = {};
    $scope.addField.lastAddedID = 0;

    // accordion settings
    $scope.accordion = {}
    $scope.accordion.oneAtATime = true;

    // create new field button click
    $scope.addNewField = function(){
        var url=$scope.form.url;
        if(!url || url.indexOf('.git')===-1){
            var btns = [{result:'ok', label: 'OK', cssClass: 'btn-primary'}];
             $dialog.messageBox("提示", "请填写正确的Url地址~！例如：git@github.com:alibaba/anyproxy.git", btns).open();
             return;
        }
        // incr field_id counter
        $scope.addField.lastAddedID++;
     
        var s=url.lastIndexOf('/');
        var e=url.lastIndexOf('.');
        var title=url.substring(s+1,e);
        var newField = {
            "field_id" : $scope.addField.lastAddedID,
            "url" : url,
            "branch" : $scope.form.branch,
            "pro_title" : title
        };
        // put newField into fields array
        $scope.form.form_fields.push(newField);
    };

    // deletes particular field on button click
    $scope.deleteField = function (field_id){
        for(var i = 0; i < $scope.form.form_fields.length; i++){
            if($scope.form.form_fields[i].field_id == field_id){
                $scope.form.form_fields.splice(i, 1);
                break;
            }
        }
    }

    // add new option to the field
    $scope.addOption = function (field){
        if(!field.field_options)
            field.field_options = new Array();

        var lastOptionID = 0;

        if(field.field_options[field.field_options.length-1])
            lastOptionID = field.field_options[field.field_options.length-1].option_id;

        // new option's id
        var option_id = lastOptionID + 1;

        var newOption = {
            "option_id" : option_id,
            "option_title" : "Option " + option_id,
            "option_value" : option_id
        };

        // put new option into field_options array
        field.field_options.push(newOption);
    }

    // delete particular option
    $scope.deleteOption = function (field, option){
        for(var i = 0; i < field.field_options.length; i++){
            if(field.field_options[i].option_id == option.option_id){
                field.field_options.splice(i, 1);
                break;
            }
        }
    }

    // decides whether field options block will be shown (true for dropdown and radio fields)
    $scope.showAddOptions = function (field){
        if(field.field_type == "radio" || field.field_type == "dropdown")
            return true;
        else
            return false;
    }

    // deletes all the fields
    $scope.reset = function (){
        $scope.form.form_fields.splice(0, $scope.form.form_fields.length);
        $scope.addField.lastAddedID = 0;
    }
    $scope.submit = function (){
        console.log(11)
        var url = 'http://localhost:18080/api/gitbatch/test';
        FormService.send(url,{data:$scope.form.form_fields}).then(function(data){
            console.log(data)
        });
    }

});
