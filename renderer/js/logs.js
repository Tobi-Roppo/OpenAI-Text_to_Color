// Read openai from SupaBase
getOpenai();
async function getOpenai () {
    // Fetch API Response
    const response = await window.axios.supaBase('get');

    // Load table from API Response
    let htmlResult = '';
    Object.keys(response).forEach(key => {
        let date = new Date(response[key].created_at.replace(' ', 'T'));
        const options = { timeZone: 'Asia/Manila' };
        const formattedDateTime = date.toLocaleString('en-US', options); //Set to PH time
        //Table
        htmlResult += '<tr>' +
            '<th scope="row">' +  response[key].prompt_id + '</th>' +
            '<td>' + response[key].text + '</td>' + //User Input
            '<td>' + response[key].result + '</td>' + //Result
            '<td>' + formattedDateTime + '</td>' + //Date and Time
            '<td>' + 
            '<div class="btn-group" role="group">' +
            '<ul class="">' +
            '<a id="btn_openai_del" class="btn btn-light" href="#" name="' + response[key].prompt_id + '">Delete</a>' +
            '</ul>' +
            '</div>' +
            // '<div class="btn-group" role="group">' +
                //     '<button type="button" class="btn btn-dark btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">' +
                //         'Action' +
                //     '</button>' +
                //     '<ul class="dropdown-menu">' +
                //         '<li><a id="btn_openai_del" class="dropdown-item" href="#" name="' + response[key].prompt_id + '">Delete</a></li>' +
                //     '</ul>' +
                // '</div>' +
        '</tr>';
    });
    // Update the table body with the generated HTML result
    const tbody = document.getElementById('tbl_openai');
    tbody.innerHTML = htmlResult;   
}


// // Alert Message
// function alertMessage(sentence){
//     window.Toastify.showToast({
//       text: sentence,
//       duration: 3000,
//       stopOnFocus: true,
//       style: {
//         textAlign: "center",
//         background: "#E76161",
//         color: "white",
//         padding: "5px",
//         marginTop: "2px"
//       }
//     });
//   }
//DELETE REQUEST TO OPENAI TABLE (SUPABASE)
const tbl_openai = document.getElementById('tbl_openai');

if (tbl_openai) {
    // Add an onclick event listener to tbl_openai
    tbl_openai.onclick = async function (e) {
        // Check if the clicked element is the delete button
        if(e.target && e.target.id == "btn_openai_del") {
            const id = e.target.name;
            // Call the window.axios.supaBase function to make a delete request
            const response = await window.axios.supaBase('delete', id);
            console.log(response);
            // Display a success message using the alertMessage function
            alertMessage("Success", "ID"  + id + " has been successfully deleted");
            // Call the getOpenai function to update the data
            getOpenai();
        }
    };
}
