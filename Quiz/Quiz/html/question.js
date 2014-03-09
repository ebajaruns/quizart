(function () {
    "use strict";

    WinJS.UI.Pages.define("/html/question.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var questionNumber = 1;
            WinJS.Utilities.query("#addNextQ").listen("click", function (event) {
                if (SdkSample.db) {
                    var questionText = WinJS.Utilities.query("#questionText").get(0).innerText;

                    var ans1 = WinJS.Utilities.query("#answerOption1").get(0).value;
                    var ans2 = WinJS.Utilities.query("#answerOption2").get(0).value;
                    var ans3 = WinJS.Utilities.query("#answerOption3").get(0).value;
                    var ans4 = WinJS.Utilities.query("#answerOption4").get(0).value;

                    var singleQuestion =
                        {
                            questionTextValue: questionText,
                            answer1: ans1,
                            answer2: ans2,
                            answer3: ans3,
                            answer4: ans4
                        };

                    QuestionsForASingleQuiz.questionsList.push(singleQuestion);

                    WinJS.Utilities.query("#answerOption1").get(0).value = "";
                    WinJS.Utilities.query("#answerOption2").get(0).value = "";
                    WinJS.Utilities.query("#answerOption3").get(0).value = "";
                    WinJS.Utilities.query("#answerOption4").get(0).value = "";
                    WinJS.Utilities.query("#questionText").get(0).innerText = "";

                    WinJS.Utilities.query("#questionNumber").get(0).innerText = ++questionNumber;
                    
                }
            });
            
            WinJS.Utilities.query("#saveAndContinue").listen("click", function (event) {
                if (SdkSample.db) {
                    var questionText = WinJS.Utilities.query("#questionText").get(0).innerText;

                    var txn = SdkSample.db.transaction(["quizzes"], "readwrite");
                    var quizStore = txn.objectStore("quizzes");

                    var applicationData = Windows.Storage.ApplicationData.current;
                    var localSettings = applicationData.localSettings;
                    var thing = localSettings.values["exampleCompositeSetting"];
                    var quizName = thing['strVal'];
                    var quizDescription = thing['description'];
                        var addResult = quizStore.add({
                            title: quizName, 
                            description: quizDescription, 
                            questions: QuestionsForASingleQuiz.questionsList
                         });


                }
            });
        }
    });

    var dbRequest = window.indexedDB.open("BookDB", 1);

    // Add asynchronous callback functions
    dbRequest.onerror = function () { WinJS.log && WinJS.log("Error creating database.", "sample", "error"); };
    dbRequest.onsuccess = function (evt) { dbSuccess(evt); };
    dbRequest.onupgradeneeded = function (evt) { dbVersionUpgrade(evt); };
    dbRequest.onblocked = function () { WinJS.log && WinJS.log("Database create blocked.", "sample", "error"); };


    function loadData(ev) {
        var books = [];
        var authors = [];
        var foldername = "data";
        var filename = "data.xml";
        var results = "";

        // Open our database tables.
        var txn = SdkSample.db.transaction(["quizzes"], "readwrite");
        txn.oncomplete = function () {
            WinJS.log && WinJS.log("Database populated.", "sample", "status");
        };
        txn.onerror = function () {
            WinJS.log && WinJS.log("Unable to populate database or database already populated.", "sample", "error");
        };
        txn.onabort = function () {
            WinJS.log && WinJS.log("Unable to populate database or database already populated.", "sample", "error");
        };

        var quizzes = [];

        //var quizCursorRequest = txn.objectStore("quizzes").index("title").openCursor();

        // As each record is returned (asynchronously), the cursor calls the onsuccess event; we store that data in our books array
        /*quizCursorRequest.onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                quizzes.push(cursor.value);
                console.log(cursor.value.title);
                if (cursor.value.timestamp) { console.log(cursor.value.timestamp); }
                cursor.continue();
            }

        };*/


    }

    function dbSuccess(evt) {
        SdkSample.db = evt.target.result;
        loadData(evt);
    }

})();
