/*
object to store the current joke
*/
var joke = {};
joke.setup = "";
joke.punchline = "";
// TODO joke.rating, collect when telling joke to user

/*
 function called when user requests jokebot tell a
 joke. fetches a joke from database and begins the
 interactive joke-telling process as joke-teller
*/
function jbd_tell()
{
   // clear any joke in progress
   clear_joke();
   // load the next one
   fetch_joke( csrf_token );

   // set flag to be used in parsing logic.
   // this way we know what part the bot should play
   interactive_state = TELL;

   // set the stage of the joke we are at
   stage = KK_INIT;

   // set a user prompt
   let msg = "Ok, I've got a joke for you. Just answer 'who's there?' when I say 'knock knock'";
   notice_text.innerHTML = msg;

   // we are initiating the joke, start off by writing the first line
   document.getElementById( "jbd_0" ).innerHTML = "knock knock!";

   // enable the submit button and input field
   // hide the others
   btn_listen.style.display  = "none";
   btn_tell.style.display    = "none";
   btn_submit.style.display  = "block";
   input_text.style.display  = "block";
   notice_text.style.display = "block";

   return;

}


/*
 function called when user offers to tell jokebot a
 joke. Begins the interactive joke-telling process 
 as joke-listener, stores joke if complete without
 errors
*/
function jbd_listen()
{

   // clear any joke in progress
   clear_joke();

   // set flag to be used in parsing logic.
   // this way we know what part the bot should play
   interactive_state = LISTEN;

   // set the stage of the joke we are at
   stage = KK_INIT;

   // set a user prompt
   let msg = "Ok, I'm ready for your joke. Just type 'knock knock' and hit enter when you are ready to start!";
   notice_text.innerHTML = msg;

   // enable the submit button and input field
   // hide the others
   btn_listen.style.display  = "none";
   btn_tell.style.display    = "none";
   btn_submit.style.display  = "block";
   input_text.style.display  = "block";
   notice_text.style.display = "block";

   return;

}


/*
 function called when user submits text input to jokebot
 while either telling or listening to a joke.
 logic to vet input and deliver appropriate responses
 lives here.
*/
function jbd_submit()
{

   if ( interactive_state == LISTEN )
   {

      if ( stage == KK_INIT )
      {
         // if it gets here, we are listening for a
	 // 'knock knock' from the user
	 let user_text = input_text.value.toLowerCase().trim();

	 // TODO test for min / max, set FAULT code if failed
	 if ( user_text.includes( "knock knock" ) )
	 {
	    // update user message and display the joke in progress
	    document.getElementById( "jbd_0" ).innerHTML = "knock knock!";
	    document.getElementById( "jbd_1" ).innerHTML = "who's there?";

	    // update stage - we've replied to init, waiting for the joke's setup
	    let msg = "ok, so far so good, type in the next part of your joke please."
	    notice_text.innerHTML = msg;
	    stage = KK_SETUP;
	    input_text.value = "";
	    return;

	 }
	 else
	 {
	    // TODO set FAULT code if failed
	    let msg = "I was expecting you to say 'knock knock'.  Can we try again?";
            notice_text.innerHTML = msg;
	    return;
	 }

      }

      if ( stage == KK_SETUP )
      {

         // if it gets here, we are listening for the joke's setup
	 // something like "wooden" or "boo" or whoknowswhat.
	 // we can't really vet this other than enbforcing a sane
	 // max length

	 let user_text = input_text.value.toLowerCase().trim();

	 if ( user_text.length < 1 )
	 {

	    let msg = "I was expecting something a little longer.  Can we try again?";
            notice_text.innerHTML = msg;
	    return;

	 }

	 if ( user_text.length > 50 )
	 {

	    let msg = "This might be funny. I don't know, but it is way too long. Can we try again?";
            notice_text.innerHTML = msg;
	    return;

	 }

         // if we fall through here, the user has given the setup
         // we display the joke in progress, update the stage and
         // prompt them to continue
	 // we also store the setup for writing to DB later
	 // TODO - if this was actually a live app, profanity filter is needed

	 joke.setup = user_text;
	 document.getElementById( "jbd_2" ).innerHTML = user_text;
	 document.getElementById( "jbd_3" ).innerHTML = user_text + " who?";

	 // update stage - we've replied to the joke's setup, awaiting punchline
	 let msg = "I can't wait to hear the punchline; type it in please."
	 notice_text.innerHTML = msg;
	 input_text.value = "";
	 stage = KK_PUNCHLINE;
         return;

      }

      if ( stage == KK_PUNCHLINE )
      {

         // if it gets here, we are listening for the joke's punchline
	 // as with the setup, we can't really vet this other than
	 // enforcing a sane max length

	 let user_text = input_text.value.toLowerCase().trim();

	 if ( user_text.length < 1 )
	 {

	    let msg = "that's not much of a punchline. can we try again?";
            notice_text.innerHTML = msg;
	    return;

	 }

	 if ( user_text.length > 256 )
	 {

	    let msg = "This might be funny. I don't know, but it is way too long. Can we try again?";
            notice_text.innerHTML = msg;
	    return;

	 }

	 joke.punchline = user_text;
	 document.getElementById( "jbd_4" ).innerHTML = user_text;

	 // update stage - we've replied to the joke's setup, awaiting punchline
	 notice_text.innerHTML = get_applause();
	 input_text.value = "";
	 stage = KK_NONE;

	 // store
	 store_joke( joke, csrf_token );

	 // reset page contents
	 // show tell button (if joke count > 0)

	 // short timeout to let the DB write.
	 setTimeout( jbd_joke_count, 300, csrf_token, btn_tell );

	 // show listen button
         btn_listen.style.display  = "block";

         // hide input field and submit button,
         btn_submit.style.display  = "none";
         input_text.style.display  = "none";

         return;

      }

   }
   else if ( interactive_state == TELL )
   {

      if ( stage == KK_INIT )
      {
         // if it gets here, we are listening for a
	 // 'who's there?' from the user
	 let user_text = input_text.value.toLowerCase().trim();

	 // TODO test for min / max, set FAULT code if failed
	 if ( user_text.includes( "who's there" ) )
	 {
	    // update user message and display the joke in progress
	    document.getElementById( "jbd_1" ).innerHTML = "who's there?";
	    document.getElementById( "jbd_2" ).innerHTML = joke.setup;

	    // update stage - we've replied to init, waiting for the joke's setup
	    let msg = "ok, this is gonna be good. You need to type '" + joke.setup + " who?' next!";
	    notice_text.innerHTML = msg;
	    stage = KK_SETUP;
	    input_text.value = "";
	    return;

	 }
	 else
	 {
	    // TODO set FAULT code if failed repeatedly
	    let msg = "I was expecting you to say 'who's there?'.  Can we try again?";
            notice_text.innerHTML = msg;
	    return;
	 }

      }

      if ( stage == KK_SETUP )
      {

         // if it gets here, we are listening for a setup response
	 // something like "wooden who?" or "boo who?".

	 let user_text = input_text.value.toLowerCase().trim();

	 if ( user_text.localeCompare( joke.setup + " who?" ) )
	 {

	    let msg = "I was sort of expecting '" + joke.setup + " who?'. Can we try again?";
            notice_text.innerHTML = msg;
	    return;

	 }

    	 // if we fall through here, the user has given the setup response
  	 // we display the joke in progress with the punchline and
         // prompt them to continue
	 document.getElementById( "jbd_3" ).innerHTML = joke.setup + " who?";
	 document.getElementById( "jbd_4" ).innerHTML = joke.punchline;

	 let msg = "Was that funny? I can't tell. Probably not."
	 notice_text.innerHTML = msg;
	 input_text.value = "";
	 stage = KK_NONE;
         interactive_state = NONE;
	 jbd_joke_count( csrf_token, btn_tell );
         btn_listen.style.display  = "block";
         btn_submit.style.display  = "none";
         input_text.style.display  = "none";

         return;

      }

      return;

   }
   else if ( interactive_state == FAULT )
   {
      // todo allow interactive error notice, post + dismiss
      // reset view
      clear_joke();
      stage = KK_NONE;
      interactive_state = NONE;
      jbd_joke_count( csrf_token, btn_tell );
      btn_listen.style.display  = "block";
      btn_submit.style.display  = "none";
      input_text.style.display  = "none";
      return;
   }

   return;
}


/*
 function called on page load to find joke count
 and enable the "tell me a joke button if we have
 any jokes in the database
*/
function jbd_joke_count( token, elem )
{

   var joke_count_promise = new Promise(function( resolve, reject )
   {
      var oXmlHttp;

      try
      {
         try
         {
            oXmlHttp=new ActiveXObject( "Microsoft.XMLHTTP" );
         }
         catch( e )
         {
	    try
            {
               oXmlHttp = new XMLHttpRequest();
            }
            catch( e )
            {
               reject( e.description );
            }
         }

         oXmlHttp.onreadystatechange=function()
         {
            if ( oXmlHttp.readyState == 4 )
            {
               if ( oXmlHttp.status == 200 )
               {
                  // we're good
                  resolve( oXmlHttp.response );
               }
               else
               {
                  reject( oXmlHttp.status.toString() );
               }
            }
         };

         oXmlHttp.open( "POST", "joke_count", true );
         oXmlHttp.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
         oXmlHttp.send( "csrfmiddlewaretoken=" + token );

      }
      catch( e )
      {
         reject( e.description );
      }

   });

   /*
     look for a count object after our
     async call is done
   */
   joke_count_promise.then(function(value)
   {

      // assume bad till we know good
      elem.style.display = "none";

      try
      {

         let j = JSON.parse( value );
         if ( j.errors != 0 )
         {
            return;
         }

         if ( j.count > 0 )
         {
            elem.style.display = "block";
         }

      }
      catch( e )
      {
         // do something inspired here
      }

   });

}


/*
 generates a string praising whatever
 terrible knock knock joke we just
 heard
 */
function get_applause()
{

   // TODO build string from random prefix/suffix combos.
   return "that was fantastic. do you know any others?";

}


/*
 clear the joke object's strings
 clear the display fields
*/
function clear_joke()
{

   joke.setup = "";
   joke.punchline = "";

   document.getElementById( "jbd_0" ).innerHTML = "";
   document.getElementById( "jbd_1" ).innerHTML = "";
   document.getElementById( "jbd_2" ).innerHTML = "";
   document.getElementById( "jbd_3" ).innerHTML = "";
   document.getElementById( "jbd_4" ).innerHTML = "";

}

/*
write joke object into our DB
requires:
token for csrf
joke object
*/
function store_joke( joke, token )
{

   var oXmlHttp;

   try
   {
      try
      {
         oXmlHttp = new ActiveXObject( "Microsoft.XMLHTTP" );
      }
      catch( e )
      {

         try
         {
	    oXmlHttp = new XMLHttpRequest();
         }
         catch( e )
         {
            // TODO client side error handler ( "returning false - no XMLHttp" );
            return false;
         }
      }
      oXmlHttp.onreadystatechange=function()
      {
         if ( oXmlHttp.readyState == 4 )
         {
            if ( oXmlHttp.status == 200 )
            {
               // we're good
               return true;
            }
            else
            {
	       // TODO client side error handler
               // we're not good
               return false;
            }
         }
      };

      let args="csrfmiddlewaretoken=" + token + "&setup=" + encodeURI( joke.setup ) + "&punchline=" + encodeURI( joke.punchline );
      oXmlHttp.open( "POST", "joke_store", true );
      oXmlHttp.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
      oXmlHttp.send( args );

   }
   catch( e )
   {

      // TODO client side error handler ("error:\n" + e.description);
      return false;
   }

}



/*
fetch random joke from our DB
requires:
token for csrf
behaviour:
writes result to joke objece in global scope
*/
function fetch_joke( token )
{

   var oXmlHttp;

   try
   {
      try
      {
         oXmlHttp = new ActiveXObject( "Microsoft.XMLHTTP" );
      }
      catch( e )
      {

         try
         {
	    oXmlHttp = new XMLHttpRequest();
         }
         catch( e )
         {
            // TODO client side error handler ( "returning false - no XMLHttp" );
            return false;
         }
      }
      oXmlHttp.onreadystatechange=function()
      {
         if ( oXmlHttp.readyState == 4 )
         {
            if ( oXmlHttp.status == 200 )
            {
               // we're good
	       let j = JSON.parse( oXmlHttp.response );

	       if ( ( j.errors != 'undefined' ) && ( j.errors > 0 ) )
               {
	          // server returned error
		  // TODO pass verbose desc for client
                  interactive_state = FAULT;
                  return;
               }
	       else
	       {

		  if ( ( j.punchline.length ) && ( j.setup.length ) )
		  {
		     // the jokes json object returned by the server
                     // has non empty values, we will assign to our
		     // joke object

                     joke.setup = j.setup;
                     joke.punchline = j.punchline;

		  }
		  else
		  {
                     // we tried and failed
                     interactive_state = FAULT;
                     return;
		  }

	       }

            }
            else
            {
	       // TODO client side error handler
               // we're not good
               return false;
            }
         }
      };

      let args="csrfmiddlewaretoken=" + token;
      oXmlHttp.open( "POST", "joke_fetch", true );
      oXmlHttp.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
      oXmlHttp.send( args );

   }
   catch( e )
   {
      // TODO client side error handler ("error:\n" + e.description);
      return false;
   }

}
