// Form Submit
const form_openai = document.getElementById("form_openai");
if (form_openai) {
  form_openai.onsubmit = async function (e) {
    e.preventDefault();

    // Get the submit button element
    const btn_submit = document.querySelector("#form_openai button[type='submit']");
    const formData = new FormData(form_openai);

    // Get the input sentence from the form data
    let sentence = formData.get("sentence-text");

    // Check if the input sentence is too short
    if (sentence.length <=2 ) {
      alertMessage("error", "Please input another text!");
      return;
    }

    // Placeholder row indicating loading state 
    btn_submit.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Please wait...';
    btn_submit.disabled = true;

    // Call OpenAI API to generate response
    const response = await window.axios.openAI(sentence);
    let result = response.choices[0].text;

    // Update the result textarea with the generated response
    document.querySelector("#div-result textarea").innerHTML = result.replace(/\n/g, "");
    
    // Save the text and result to the SupaBase database
    const db_response = await window.axios.supaBase('post', '', {
        text: sentence, 
        result: result,
      });
    // Log the database response
    console.log(db_response); 
    document.body.style.backgroundColor=result.replace(/\n/g, "");

    btn_submit.innerHTML = 'Submit'; // Update the button label
    btn_submit.disabled = false; // Enable the button
  };
}

// Alert Message
function alertMessage(status, sentence){
  window.Toastify.showToast({
    text: sentence,
    duration: 3000,
    stopOnFocus: true,
    style: {
        background: "transparent",
        color: "white",
        padding: "5px",
        marginTop: "2px",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
     
    }
  });
}




