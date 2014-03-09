(function () {
    "use strict";

    WinJS.UI.Pages.define("/html/create.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            WinJS.Utilities.query("#apakspakala").listen("click", function (event) {
                if (SdkSample.db) {
                    var description = WinJS.Utilities.query("#quizDescription").get(0).innerText;
                    var title = WinJS.Utilities.query("#quizTitle").get(0).value;
                    var txn = SdkSample.db.transaction(["quizzes"], "readwrite");
                    var quizStore = txn.objectStore("quizzes");

                    var current = new Date();
                    var hours = current.getHours();
                    var minutes = current.getMinutes();
                    var addResult = quizStore.add({ title: title, question1: description, timestamp: hours + ':' + minutes });
                    var applicationData = Windows.Storage.ApplicationData.current;
                    var localSettings = applicationData.localSettings;
                    var composite = new Windows.Storage.ApplicationDataCompositeValue();
                    composite["strVal"] = title;
                    composite["description"] = description;

                    localSettings.values["exampleCompositeSetting"] = composite;
                }
            });
        }
    });

    //deleteDB();
    var newCreate = false;

    // Create the request to open the database, named BookDB. If it doesn't exist, create it and immediately
    // upgrade to version 1.
    var dbRequest = window.indexedDB.open("BookDB", 1);

    // Add asynchronous callback functions
    dbRequest.onerror = function () { WinJS.log && WinJS.log("Error creating database.", "sample", "error"); };
    dbRequest.onsuccess = function (evt) { dbSuccess(evt); };
    dbRequest.onupgradeneeded = function (evt) { dbVersionUpgrade(evt); };
    dbRequest.onblocked = function () { WinJS.log && WinJS.log("Database create blocked.", "sample", "error"); };

    // Reset the flag that indicates whether this is a new creation request. 
    // Assume that the database was previously created.
    newCreate = false;

    function dbVersionUpgrade(evt) {

        // If the database was previously loaded, close it. 
        // Closing the database keeps it from becoming blocked for later delete operations.
        /*if (SdkSample.db) {
            SdkSample.db.close();
        }*/
        SdkSample.db = evt.target.result;

        // Get the version update transaction handle, since we want to create the schema as part of the same transaction.
        var txn = evt.target.transaction;

        // Create the books object store, with an index on the book title. Note that we set the returned object store to a variable
        // in order to make further calls (index creation) on that object store.
        //var quizStore = SdkSample.db.createObjectStore("quizzes", { keyPath: "id", autoIncrement: true });
        var quizStore = SdkSample.db.createObjectStore("quizzes", { keyPath: "title" });
        //quizStore.createIndex("title", "title", { unique: true });

        // Once the creation of the object stores is finished (they are created asynchronously), log success.
        txn.oncomplete = function () {
            WinJS.log && WinJS.log("Database schema created.", "sample", "status");
        };
        newCreate = true;
    }

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

        var quizStore = txn.objectStore("quizzes");

        var current = new Date();
        var hours = current.getHours();
        var minutes = current.getMinutes();
        var addResult = quizStore.add({ title: 'quiz1', question1: 'do you like to kick dogs', timestamp: hours + ':' + minutes });


        addResult.onsuccess = function () {
            console.log("great success");
        };
        addResult.onerror = function () {
            console.log("failed to add");
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
        // Log whether the app tried to create the database when it already existed. 
        /*if (!newCreate) {
            // Close this additional database request
            var db = evt.target.result;
            db.close();

            WinJS.log && WinJS.log("Database schema already exists.", "sample", "error");
            return;
        }*/

        /*if (SdkSample.db) {
            SdkSample.db.close();
        }*/
        SdkSample.db = evt.target.result;
        loadData(evt);
    }

    function deleteDB() {

        // Close and clear the handle to the database, held in the parent SdkSample namespace.
        if (SdkSample.db) {
            SdkSample.db.close();
        }
        SdkSample.db = null;
        var dbRequest = window.indexedDB.deleteDatabase("BookDB");
        dbRequest.onerror = function () { WinJS.log && WinJS.log("Error deleting database.", "sample", "error"); };
        dbRequest.onsuccess = function () { WinJS.log && WinJS.log("Database deleted.", "sample", "status"); };
        dbRequest.onblocked = function () {
            WinJS.log && WinJS.log("Database delete blocked.", "sample", "error");
        };
    }

})();
