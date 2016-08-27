'use strict';

angularApp.service('FormService', function FormService($q,$http, $dialog) {

    return {
        send: function(link, parameters) {
            let deferred = $q.defer();
            $http.post(link, parameters)
                .success(function(data) {
                    deferred.resolve(data);
                    /*if (data.resultCode == '200') {
                        deferred.resolve(data);
                    } else {
                        deferred.promise.catch(function(data) {
                            var btns = [{ result: 'ok', label: 'OK', cssClass: 'btn-primary' }];
                            $dialog.messageBox("提示", "错误", btns).open();
                        });
                        deferred.reject(data);
                    }*/
                }).error(function() {
                    deferred.reject();
                });
            return deferred.promise;
        }
    };
});
