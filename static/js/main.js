const convertBoolean = (value) => { return value === "true" } /* data that is feteched from localStorage is stored as a string, so this data must be converted to a boolean to be recognized correctly by javascirpt in its respective function */
let username;
let password; /* username and password values are initially empty before any user input is given, these are global values not limited to any functions scope so that it can be used within multiple functions*/
let sentimentFilter = window.localStorage.getItem('filter') ? convertBoolean(window.localStorage.getItem('filter')) : false; /* gets the users sentiment toggle value, either is saved in local storage if the user has visited before or defaults to false if not found */
const modal = document.getElementById("myModal")

const sentimentToggle = document.getElementById("sentiment-toggle")
sentimentToggle.onclick = function () { /* when the user clicks the sentiment toggle */
    sentimentFilter = !sentimentFilter /* set the value of the sentiment filter to the opposite/inverse of what it was before */
    window.localStorage.setItem('filter', sentimentFilter)
    document.getElementById("sentiment-toggle").checked = sentimentFilter
    getTweets() /* refetch the tweets with the new sentimentFilter value */
}
const registerBtn = document.getElementById("register-button")
/* When the user clicks on the register button, open the modal */
registerBtn.onclick = function () {
    modal.style.display = "flex"
    document.getElementById('form-header').innerText = 'Sign up to Twitter'
    document.getElementById('form-oauth2-logins').style.display = 'flex' /* dynamically update the styles */
    document.getElementById('alt-login-section').style.display = 'flex'
    const usernameInput = document.getElementById('username-input')
    let pwInput = document.createElement("input")
    usernameInput.disabled = false
    usernameInput.style.opacity = '1'
    pwInput.setAttribute("type", "password")
    pwInput.setAttribute("id", "password-input")
    pwInput.setAttribute("name", "password")
    pwInput.setAttribute("placeholder", "Password")
    pwInput.setAttribute("class", "register-input")
    const registerForm = document.getElementById("register-form")
    const registerBtn = document.getElementById('register-submit-button')
    registerForm.insertBefore(pwInput, registerForm.children[1]) /* place the password input field in a specific position */
    document.getElementById('forgot-pw-button').style.display = 'none'
    document.getElementById('sign-up-notice').style.display = 'none'
    registerBtn.innerHTML = 'Register'
    registerBtn.onclick = register /* execute the register function when the register button is clicked */
}

const loginBtn = document.getElementById("login-button");
/* When the user clicks on the login button, open the modal */
loginBtn.onclick = function () {
    modal.style.display = "flex"
    document.getElementById('form-header').innerText = 'Sign in to Twitter'
    const nextBtn = document.getElementById('register-submit-button')
    document.getElementById('forgot-pw-button').style.display = 'block'
    document.getElementById('sign-up-notice').style.display = 'block'
    nextBtn.innerHTML = 'Next'
    nextBtn.onclick = showPasswordInput /* when the next button is clicked, the modal is dynamically updated to show the password input section */
}


function showPasswordInput(e) {
    e.preventDefault()
    username = document.getElementById('username-input').value
    if (!username) return alert("You must enter a username to continue")
    document.getElementById('form-header').innerText = 'Enter your password'
    document.getElementById('form-oauth2-logins').style.display = 'none'
    document.getElementById('alt-login-section').style.display = 'none'
    const usernameInput = document.getElementById('username-input')
    const pwInput = document.createElement("input")
    pwInput.setAttribute("type", "password")
    pwInput.setAttribute("id", "password-input")
    pwInput.setAttribute("name", "password")
    pwInput.setAttribute("placeholder", "Password")
    pwInput.setAttribute("class", "register-input")
    usernameInput.disabled = true /* do not allow the user to change the username as they've entered it already and now have to enter the password for it */
    usernameInput.style.opacity = '0.5' /* update the styling so the field indicates to the user that they cannot enter it */
    const registerForm = document.getElementById("register-form")
    registerForm.insertBefore(pwInput, registerForm.children[1])
    document.getElementById('forgot-pw-button').style.display = 'none'
    document.getElementById('sign-up-notice').style.display = 'none' /* dynamically update the modal to have the enter password UI design */
    const loginBtn = document.getElementById('register-submit-button')
    loginBtn.innerHTML = 'Login'
    loginBtn.onclick = login /* when the login button is pressed, the user finally begins the login request */
}

function register(e) {
    e.preventDefault()
    const username = document.getElementById('username-input').value
    const password = document.getElementById('password-input').value
    if (!username) return alert('You must enter a username') /* checks if fields are empty */
    if (!password) return alert('You must enter a password')
    else if (username.length < 1 || username.length > 60) return alert('Your username must be between 1-60 characters') /* checks that are done client-sided and server-sided to prevent invalid values and string lengths being passed into the database */
    else if (password.length < 8) return alert('Your password must be more than 8 characters long') /* user must enter a semi-secure password, could be improved with more checks such as checking if a special character or numbers are in the password */
    const http_req_1 = new XMLHttpRequest()
    http_req_1.open("POST", `https://twitter.roanj.com/accounts/register`) /* send post request to API */
    http_req_1.addEventListener("load", (e) => { /* response event */
        let responseData = http_req_1.responseText
        if (responseData.length !== 0) {
            const jsonResp = JSON.parse(responseData) /* parses data return by API, communication is done via JSON */
            if (!jsonResp.success) return alert(jsonResp.reason) /* if the request failed for whatever reason, the user is alerted with a prompt naming the reason why their request failed i.e. a bad username or password */
            window.localStorage.setItem('token', jsonResp.token) /* if there was no error and the request was successful, it sets user jwt token */
            window.location.href = '/'
        }
    });
    http_req_1.send(JSON.stringify({ "username": username, "password": password })) /* sends username and password as body data */
}
function login(e) {
    e.preventDefault()
    const username = document.getElementById('username-input').value
    const password = document.getElementById('password-input').value
    if (!username) return alert('You must enter a username') /* checks if fields are empty */
    else if (!password) return alert('You must enter a password')
    else if (username.length < 1 || username.length > 60) return alert('Your username must be between 1-60 characters')
    else if (password.length < 8) return alert('Your password must be more than 8 characters long')
    const http_req_1 = new XMLHttpRequest()
    http_req_1.open("POST", `https://twitter.roanj.com/accounts/login`)  /* send post request to API */
    http_req_1.addEventListener("load", (e) => {  /* response event */
        let responseData = http_req_1.responseText
        if (responseData.length !== 0) {
            const jsonResp = JSON.parse(responseData) /* parses data return by API, communication is done via JSON */
            if (!jsonResp.success) return alert(jsonResp.reason) /* if the request failed for whatever reason, the user is alerted with a prompt naming the reason why their request failed i.e. a bad username or password */
            window.localStorage.setItem('token', jsonResp.token)  /* if there was no error and the request was successful, it sets user jwt token */
            window.location.href = '/'
        }
    });
    http_req_1.send(JSON.stringify({ "username": username, "password": password })) /* sends username and password as body data */
}

function search(e) {
    e.preventDefault()
    const searchValue = document.getElementById('tweet-search').value
    if (!searchValue) return alert('You must enter something to search') /* makes sure client enters a value for the search query */
    getTweets(searchValue) /* requests to retrieve all tweets with optional param of searchValue being filled in */
}

const tweetBtn = document.getElementById("tweet-input-btn")
tweetBtn.onclick = function (e) {
    e.preventDefault()
    const token = window.localStorage.getItem('token')
    const tweetContent = document.getElementById('tweet-input').value
    if (!token) return alert('You are not logged in, please refresh the page') /* makes sure user has a token to be sent to the server before sending request */
    if (!tweetContent) return alert('You must enter some content to tweet')
    else if (tweetContent.length > 600) return alert('Your tweet must be under 600 characters') /* database design only allows the tweeted content to be 600 characters or less */
    const http_req_1 = new XMLHttpRequest()
    http_req_1.open("POST", `https://twitter.roanj.com/tweets/post`)
    http_req_1.addEventListener("load", (e) => {
        let responseData = http_req_1.responseText
        if (responseData.length !== 0) {
            const jsonResp = JSON.parse(responseData)
            if (!jsonResp.success) return alert(jsonResp.reason)
            getTweets() /* if there was no errors returned by the API, then another request is made to fetch the tweets again to display the new tweet */

        }
    });
    http_req_1.send(JSON.stringify({ "tweet": tweetContent, "token": token }))
}
function editTweet(tweet_id, tweet_content) {
    const editedTweet = prompt('Update your tweet', tweet_content)
    const token = window.localStorage.getItem('token')
    if (!token) return alert('You are not logged in, please refresh the page')
    else if (!editedTweet) return alert('You must enter some content in your edited tweet')
    else if (editedTweet.length > 600) return alert('Your edited tweet must be under 600 characters')
    const http_req_1 = new XMLHttpRequest()
    http_req_1.open("POST", `https://twitter.roanj.com/tweets/update`)
    http_req_1.addEventListener("load", (e) => {
        let responseData = http_req_1.responseText
        if (responseData.length !== 0) {
            const jsonResp = JSON.parse(responseData)
            if (!jsonResp.success) return alert(jsonResp.reason)
            getTweets()
            alert('Successfully updated tweet')
        }
    });
    http_req_1.send(JSON.stringify({ "tweet_id": tweet_id, "tweet_edit": editedTweet, "token": token })) /* sends tweet ID to identify which tweet is being edited, server checks if the tweet ID belongs to the user */

}
function deleteTweet(tweet_id) {
    const token = window.localStorage.getItem('token')
    if (!token) return alert('You are not logged in, please refresh the page')
    const http_req_1 = new XMLHttpRequest()
    http_req_1.open("POST", `https://twitter.roanj.com/tweets/delete`)
    http_req_1.addEventListener("load", (e) => {
        let responseData = http_req_1.responseText
        if (responseData.length !== 0) {
            const jsonResp = JSON.parse(responseData)
            if (!jsonResp.success) return alert(jsonResp.reason)
            getTweets()
            alert('Successfully deleted tweet')
        }
    });
    http_req_1.send(JSON.stringify({ "tweet_id": tweet_id, "token": token }))
}

function likeTweet(tweet_id) {
    const token = window.localStorage.getItem('token')
    if (!token) return alert('You are not logged in, please refresh the page')
    const http_req_1 = new XMLHttpRequest()
    http_req_1.open("POST", `https://twitter.roanj.com/tweets/like`)
    http_req_1.addEventListener("load", (e) => {
        let responseData = http_req_1.responseText
        if (responseData.length !== 0) {
            const jsonResp = JSON.parse(responseData)
            if (!jsonResp.success) return alert(jsonResp.reason)
            getTweets()
        }
    });
    http_req_1.send(JSON.stringify({ "tweet_id": tweet_id, "token": token }))
}


async function checkLogin() {
    return new Promise((resolve, reject) => { /* utilize promises to make sure this function excecutes before doing anything else within the DOMContentLoaded event */
        const token = window.localStorage.getItem('token')
        if (!token) return resolve(false)/* send value false (not logged) in as user does not have a JWT token saved */
        const http_req_1 = new XMLHttpRequest()
        http_req_1.open("POST", `https://twitter.roanj.com/accounts/check-login`)
        http_req_1.addEventListener("load", (e) => {
            let responseData = http_req_1.responseText
            if (responseData.length !== 0) {
                const jsonResp = JSON.parse(responseData)
                return resolve(jsonResp.success) /* jsonResp.success is either true or false true or false */
            }
            return resolve(false) /* send value false (not logged) in as it failed to get the API response */
        })
        http_req_1.send(JSON.stringify({ "token": token }))
    })
}

function getTweets(search = null) {
    const http_req_1 = new XMLHttpRequest()
    const token = window.localStorage.getItem('token') ? window.localStorage.getItem('token') : ''
    http_req_1.open("POST", `https://twitter.roanj.com/tweets/fetch`)
    http_req_1.addEventListener("load", (e) => {
        let responseData = http_req_1.responseText
        if (responseData.length !== 0) {
            const jsonResp = JSON.parse(responseData)
            removeExistingTweets()
            for (let tweet of jsonResp.tweets) {
                createTweetPost(tweet)
            }
        }
    });
    http_req_1.send(JSON.stringify({ "token": token, "sentimentFilter": sentimentFilter, "searchValue": search }))
}

function removeExistingTweets() {
    let nodesToRemove = []
    const parent = document.getElementById("twitter-feed")
    const childNodes = parent.childNodes
    childNodes.forEach((node, index) => {
        if (index >= 5) { /* the first 5 elements in the twitter-feed div are the tweet input and show more tweets section, from index position 5 onwards is all user tweets */
            nodesToRemove.push(node) /* store in a list as if you delete the node directly, the list (childNodes) will change in real-time and not delete all the elements*/
        }
        if (Number(childNodes.length) - 1 === index) { /* when it has reached the end of the list, its identified by comparing the index number to the length of the list-1 as the length of the list-1 is the last index number */
            for (let deleteNode of nodesToRemove) { /* loop through all list items of tweets to remove */
                deleteNode.remove() /* removes it from the DOM */
            }
        }
    })
}

function createTweetPost(tweet) {
    const twitterPost = document.createElement('div')
    twitterPost.classList.add('twitter-post')
    twitterPost.innerHTML = tweet.is_self ? selfTweet : normalTweet /* the API provides if the tweet is from your own account or from another, based on this there are different designs as the user should know which tweets they liked and which ones are their own which they can edit or delete */
    twitterPost.setAttribute('id', `tweet-${tweet.tweet_id}`)
    twitterPost.children[0].children[1].children[0].children[0].innerText = tweet.author.charAt(0).toUpperCase() + tweet.author.slice(1) /* dynamically updates base tweet component to include data returned by the api, in this case the name of the user capitalized */
    twitterPost.children[0].children[1].children[0].children[1].innerText = `@${tweet.author}` /* dynamically updates base tweet component to include data returned by the api, in this case the username with an @ behind it */
    twitterPost.children[0].children[1].children[1].children[0].innerText = tweet.content /* dynamically updates base tweet component to include data returned by the api, in this case the tweet that was made */
    if (tweet.has_liked) {
        twitterPost.children[0].children[1].children[1].children[1].children[0].children[2].style.color = 'rgb(249, 24, 128)' /* dynamically updates base tweet component to include data returned by the api, if the user has liked this tweet it will fill the heart button in red */
    }
    twitterPost.children[0].children[1].children[1].children[1].children[0].children[2].children[0].style.fill = 'currentcolor' /* dynamically updates base tweet component to include data returned by the api, in this case the heart svg icon colour is filled based on the colour set */
    twitterPost.children[0].children[1].children[1].children[1].children[0].children[2].children[1].innerText = tweet.likes /* dynamically updates base tweet component to include data returned by the api, in this case the amount of likes on the tweet */
    twitterPost.children[0].children[1].children[1].children[1].children[0].children[0].children[1].innerText = Math.floor(Math.random() * 1000) /* dynamically updates base tweet component to include data returned by the api, in this case it fills the tweet comment amount with a random number between 0-1000  */
    twitterPost.children[0].children[1].children[1].children[1].children[0].children[1].children[1].innerText = Math.floor(Math.random() * 1000)  /* dynamically updates base tweet component to include data returned by the api, in this case it fills the tweet retweet amount with a random number between 0-1000  */
    if (tweet.is_self) {
        twitterPost.children[0].children[1].children[0].children[4].onclick = function () {
            editTweet(tweet.tweet_id, tweet.content) /* sets edit tweet functionality if the tweet belongs to the user */
        }
        twitterPost.children[0].children[1].children[1].children[1].children[0].children[3].onclick = function () {
            deleteTweet(tweet.tweet_id) /* sets delete tweet functionality if the tweet belongs to the user */
        }
    }
    twitterPost.children[0].children[1].children[1].children[1].children[0].children[2].onclick = function () {
        likeTweet(tweet.tweet_id) /* sets the like tweet functionality for tweet */
    }
    const twitterFeed = document.getElementById("twitter-feed")
    twitterFeed.insertBefore(twitterPost, twitterFeed.children[2]) /* inserts tweet after the tweet input and show more tweets section in the twitter-feed div */
}

const span = document.getElementsByClassName("close")[0]
span.onclick = function () { /* when the close button is clicked, hideModal is executed */
    hideModal()
}
window.onclick = function (event) {
    if (event.target == modal) { // When the user clicks anywhere outside of the modal, hide the modal
        hideModal()
    }
}
function hideModal() {
    modal.style.display = "none" /* hides the modal display */
    const usernameInput = document.getElementById('username-input')
    const pwInputElement = document.getElementById('password-input')
    if (pwInputElement) pwInputElement.remove() /* removes pw input element as the modal is now closed, it should not be displayed if the user chooses to show the registration section */
    usernameInput.disabled = false /* username input no longer disabled when the modal is reset to its initial design */
    usernameInput.style.opacity = '1' /* set opacity of user input to 1 to show the user that you can enter text on there */
}

document.addEventListener("DOMContentLoaded", async function (e) { /* when the content on the page has loaded */
    const isLoggedIn = await checkLogin() /* check if the users token is valid */
    if (isLoggedIn) document.getElementById('unregistered-footer').style.display = 'none' /* if its valid, then hide the footer showing to login or sign up, otherwise keep it there as the user needs to either register or login */
    document.getElementById("sentiment-toggle").checked = sentimentFilter /* set the sentiment toggle to the value of whether the user has the sentiment filter on or off */
    getTweets() /* fetch all initial tweets */
})

/* components: these are components that are reused, normally in a framework like React you could create this better
but since I used vanilla javascript, I thought it would be suitable to place it in a string, 
set the divs innerHTML to it and then dynamically update the content within the div using javascript based on the 
API data given
 
there is normalTweet which is either not your own tweet or when you're not logged in and there is selfTweet which is a tweet sent by yourself
 
the reason for the two different definitions is because both have different designs and options available 
*/

const normalTweet = ` 
<div class="twitter-post-content">
<div class="tweet-profile-picture">
    <img class="profile-picture"
        src="https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png">
</div>
<div class="tweet-grid">
    <div class="twitter-author-info">
        <div class="tweet-header-style twitter-name">Roan</div>
        <div class="tweet-header-style twitter-username">@roanj</div>
        <div class="tweet-header-style seperator">·</div>
        <div class="tweet-header-style tweet-date">01 Dec</div>
        
    </div>
    <div class="content">
        <div class='tweet-content'></div>
        <div class="tweet-extras">
            <div class="tweet-options">
                <a href="/" class="comments-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-option-icon">
                        <g>
                            <path
                                d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z">
                            </path>
                        </g>
                    </svg>
                    <div>0</div>
                </a>
                <a href="/" class="retweet-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-option-icon">
                        <g>
                            <path
                                d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z">
                            </path>
                        </g>
                    </svg>
                    <div>0</div>
                </a>
                <a href="#" class="heart-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-option-icon">
                        <g>
                            <path
                                d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z">
                            </path>
                        </g>
                    </svg>
                    <div>0</div>
                </a>

                <a href="/" class="share-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-option-icon">
                        <g>
                            <path
                                d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z">
                            </path>
                        </g>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</div>
</div>
`

const selfTweet = `
<div class="twitter-post-content">
<div class="tweet-profile-picture">
    <img class="profile-picture"
        src="https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png">
</div>
<div class="tweet-grid">
    <div class="twitter-author-info">
        <div class="tweet-header-style twitter-name">Roan</div>
        <div class="tweet-header-style twitter-username">@roanj</div>
        <div class="tweet-header-style seperator">·</div>
        <div class="tweet-header-style tweet-date">01 Dec</div>
        <div class="tweet-header-style tweet-edit">
        <svg class="tweet-option-icon" viewBox="0 0 24 24" aria-hidden="true" class="r-1nao33i r-4qtqp9 r-yyyyoo r-1q142lx r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M14.23 2.854c.98-.977 2.56-.977 3.54 0l3.38 3.378c.97.977.97 2.559 0 3.536L9.91 21H3v-6.914L14.23 2.854zm2.12 1.414c-.19-.195-.51-.195-.7 0L5 14.914V19h4.09L19.73 8.354c.2-.196.2-.512 0-.708l-3.38-3.378zM14.75 19l-2 2H21v-2h-6.25z"></path></g></svg>
        </div>
    </div>
    <div class="content">
        <div class='tweet-content'></div>
        <div class="tweet-extras">
            <div class="tweet-options">
                <a href="/" class="comments-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-option-icon">
                        <g>
                            <path
                                d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z">
                            </path>
                        </g>
                    </svg>
                    <div>0</div>
                </a>
                <a href="/" class="retweet-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-option-icon">
                        <g>
                            <path
                                d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z">
                            </path>
                        </g>
                    </svg>
                    <div>0</div>
                </a>
                <a href="#" class="heart-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="tweet-option-icon">
                        <g>
                            <path
                                d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z">
                            </path>
                        </g>
                    </svg>
                    <div>0</div>
                </a>
                <a href="#" id='delete-icon' class="share-icon">
                   
                <svg class="tweet-option-icon tweet-delete" viewBox="0 0 24 24" aria-hidden="true" class="r-9l7dzd r-4qtqp9 r-yyyyoo r-1q142lx r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 6.28 22 7.86 22h8.27c1.58 0 2.88-1.22 3-2.79L19.93 8H21V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.52-.47.93-1 .93H7.86c-.53 0-.96-.41-1-.93L6.07 8h11.85l-.79 11.07zM9 17v-6h2v6H9zm4 0v-6h2v6h-2z"></path></g></svg>
                </a>
            </div>
        </div>
    </div>
</div>
</div>

`