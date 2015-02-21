/**
 * Created by jovinbm on 1/19/15.
 */
angular.module('qaApp')

    .factory('stateService', ['globals',
        function (globals) {
            var currentTab = "home";
            var questionOnView;

            var colClasses = {
                "questionFeed": {
                    "default": "col-lg-7 col-md-7 col-sm-8 col-xs-12"
                },
                "trending": {
                    "default": "col-lg-3 col-md-4 col-sm-4 hidden-xs",
                    "home": "col-lg-3 col-md-4 col-sm-4 hidden-xs",
                    "trending": "col-lg-10 col-md-11 col-sm-10 col-xs-12"
                },
                "onlineColumn": {
                    "default": "col-lg-2 col-md-1 hidden-sm hidden-xs",
                    "home": "col-lg-2 col-md-1 hidden-sm hidden-xs",
                    "trending": "col-lg-2 col-md-1 col-sm-2 hidden-xs"
                }
            };

            return {
                tab: function (tab) {
                    if (tab) {
                        currentTab = tab
                    }
                    return currentTab;
                },

                trClass: function () {
                    return colClasses.trending[currentTab];
                },

                qClass: function () {
                    return colClasses.questionFeed.default;
                },

                oClass: function () {
                    return colClasses.onlineColumn[currentTab];
                },

                questionOnView: function (index) {
                    if (index) {
                        questionOnView = index;
                    }
                    return questionOnView;
                }
            }

        }])

    .factory('detailStorage', ['$rootScope', 'globals',
        function ($rootScope, globals) {
            var detailPrototype = {};
            return {
                add: function (questionArray, broadcast) {
                    questionArray.forEach(function (questionObject) {
                        var temp = {};
                        //change time-string from mongodb to actual time
                        var mongoDate = new Date(questionObject.timeAsked);
                        temp.questionTime = mongoDate.toDateString() + " " + mongoDate.toLocaleTimeString();

                        var upvotedIndexes = globals.upvotedIndexes();
                        var questionIndex = questionObject.questionIndex;
                        var questionClass = "a" + questionIndex;
                        temp.questionIndex = questionIndex;
                        temp.questionClass = questionClass;

                        function searchArrayIfExists(name, theArray) {
                            return (theArray.indexOf(name) > -1)
                        }

                        /*if already updated, insert a new button class with a btn-warning class, and a disabled attribute*/
                        if (searchArrayIfExists(questionIndex, upvotedIndexes)) {
                            temp.buttonClass = questionClass + "b" + " btn btn-warning btn-xs upvote";
                            temp.listGroupClass = "list-group-item-warning";
                            temp.upvoted = true;
                        } else {
                            temp.buttonClass = questionClass + "b" + " btn btn-info btn-xs upvote";
                            temp.listGroupClass = "list-group-item-info";
                            temp.upvoted = false;
                        }

                        detailPrototype[questionIndex] = temp;
                    });

                    if (broadcast) {
                        $rootScope.$broadcast('questionReference', detailPrototype);
                    }
                    return detailPrototype;
                },

                updateReferenceIndexes: function (broadcast, indexToRemove) {
                    //check first that the detailPrototype is not empty
                    if (Object.keys(detailPrototype).length !== 0) {
                        var currentIndexes = globals.upvotedIndexes();
                        currentIndexes.forEach(function (index) {
                            detailPrototype[index].buttonClass = "a" + index + "b" + " btn btn-warning btn-xs upvote";
                            detailPrototype[index].listGroupClass = "list-group-item-warning";
                            detailPrototype[index].upvoted = true;
                        });
                    }
                    if (indexToRemove || indexToRemove == 0) {
                        detailPrototype[indexToRemove].buttonClass = "a" + indexToRemove + "b" + " btn btn-info btn-xs upvote";
                        detailPrototype[indexToRemove].listGroupClass = "list-group-item-info";
                        detailPrototype[indexToRemove].upvoted = false;
                    }
                    if (broadcast) {
                        $rootScope.$broadcast('questionReference', detailPrototype);
                    }
                    return detailPrototype;
                },


                getReference: function () {
                    return detailPrototype;
                },


                disableButton: function (index) {
                    detailPrototype[index].buttonClass = "a" + index + "b" + " btn btn-warning btn-xs upvote";
                    return detailPrototype;
                },

                enableButton: function (index) {
                    detailPrototype[index].buttonClass = "a" + index + "b" + " btn btn-info btn-xs upvote";
                    return detailPrototype;
                }
            }

        }]);