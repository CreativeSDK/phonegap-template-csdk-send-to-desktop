/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.initializeUI();
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        this.elements.editPictureButton.addEventListener('click', this.editPicture, false);
        this.elements.sendToDesktopButton.addEventListener('click', this.sendToDesktop, false);
        this.elements.takePictureButton.addEventListener('click', this.takePicture, false);
        this.elements.userAuthButton.addEventListener('click', this.handleAuth, false);  
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    editPicture: function() {
        /* Prep work for calling `.edit()` */
        function success(newUrl) {
            console.log("Success!", newUrl);

            app.elements.targetImage.src = newUrl;
        }

        function error(error) {
            console.log("Error!", error);
        }

        var imageUrl = app.elements.targetImage.src;

        var options = {
            // outputType: CSDKImageEditor.OutputType.JPEG,
            // tools: [
            //     CSDKImageEditor.ToolType.EFFECTS,
            //     CSDKImageEditor.ToolType.CROP
            // ],
            // quality: 50
        };

        /* Launch the Image Editor */
        CSDKImageEditor.edit(success, error, imageUrl, options);
    },
    elements: {
        editPictureButton: document.getElementById('edit-picture'),
        loginPrompt: document.getElementById('login-prompt'),
        sendToDesktopButton: document.getElementById('send-to-desktop'),
        takePictureButton: document.getElementById('take-picture'),
        targetImage: document.getElementById('target-image'),
        throbber: document.getElementById('throbber'),
        userAuthButton: document.getElementById('user-auth'),
        userAuthGreeting: document.getElementById('user-greeting')
    },
    handleAuth: function() {
        if (app.user) {
            app.logout();
        }
        else {
            app.login();
        }
    },
    initializeUI: function() {
        this.elements.userAuthGreeting.style.visibility = "hidden";
        this.elements.editPictureButton.disabled = true;
        this.elements.sendToDesktopButton.disabled = true;
        this.elements.takePictureButton.disabled = true;
    },
    login: function() {

        /* Prep work for calling `.login()` */
        function success(userObject) {
            console.log("Login Success!", userObject);

            app.user = userObject;
            app.elements.loginPrompt.style.visibility = "hidden";
            app.elements.userAuthButton.innerHTML = "Log Out";
            app.elements.userAuthGreeting.innerHTML = "Welcome, " + app.user.displayName;
            app.elements.userAuthGreeting.style.visibility = "visible";
            app.elements.targetImage.style.opacity = 1;
            app.toggleButtons();
        }

        function error(error) {
            console.log("Error!", error);
        }

        /* Launch User Auth UI */
        CSDKUserAuth.login(success, error);
    },
    logout: function() {

        /* Prep work for calling `.logout()` */
        function success() {
            console.log("Logout Success!");

            app.user = null;
            app.elements.loginPrompt.style.visibility = "visible";
            app.elements.userAuthButton.innerHTML = "Log In";
            app.elements.userAuthGreeting.innerHTML = "Welcome";
            app.elements.userAuthGreeting.style.visibility = "hidden";
            app.elements.targetImage.style.opacity = .5;
            app.toggleButtons();
        }

        function error(error) {
            console.log("Error!", error);
        }

        /* Log out user */
        CSDKUserAuth.logout(success, error);
    },
    /* Make a helper function to send to Adobe desktop apps */
    sendToDesktop: function() {

        /* Prep work for calling `.send()` */
        function success() {
            console.log("Sent to Photoshop!");

            app.elements.throbber.style.visibility = "hidden";
            app.elements.targetImage.style.opacity = 1;
        }

        function error(error) {
            console.log("Error!", error);

            app.elements.throbber.style.visibility = "hidden";
            app.elements.targetImage.style.opacity = 1;
        }

        var uri = document.getElementById('target-image').src;

        var ccApplication = CSDKSendToDesktop.AppType.PHOTOSHOP;

        var mimeType = "image/jpeg";


        /*
            Send to desktop
            ---------------
            NOTE: your user must be logged in (`this.login`) via the
            User Auth plugin BEFORE calling this.

            See the User Auth plugin repo's sample code for more info.
        */
        if (app.user) {
            app.elements.throbber.style.visibility = "visible";
            app.elements.targetImage.style.opacity = .5;
            CSDKSendToDesktop.send(success, error, uri, ccApplication, mimeType);
        }
        else {
            console.log("Log in first!");
        }
    },
    takePicture: function() {
        navigator.camera.getPicture(function(picUri) {
            document.getElementById('target-image').src = picUri;
        }, function(message) {
            console.log('Failed because: ' + message);
        }, {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI
        });
    },
    toggleButtons: function() { 
        app.elements.editPictureButton.disabled = !app.elements.editPictureButton.disabled;
        app.elements.sendToDesktopButton.disabled = !app.elements.sendToDesktopButton.disabled;
        app.elements.takePictureButton.disabled = !app.elements.takePictureButton.disabled;   
    },
    user: null
};