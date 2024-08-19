$(document).ready(function () {
    let current_fs, next_fs, previous_fs; // fieldsets
    let opacity;
    let isValid;

    

    // Function to get data from the form fields and populate the corresponding review section
    function populateReviewSection(step) {
        let reviewContent = "";
        let stepFields = $(`fieldset[data-step='${step}']`).find(':input').not(':button');

        stepFields.each(function () {
            let label = $(this).siblings('label').text() || $(this).closest('.input-group').find('label').text();
            let value;

            if ($(this).is(':radio')) {
                // For radio buttons, display the checked value
                label = $(this).closest('.input-group').find('label.fieldlabels').text();
                if ($(this).is(':checked')) {
                    value = $(this).val();
                    reviewContent += `<p><strong>${label}</strong> ${value}</p>`;
                }
            } else if ($(this).is(':checkbox')) {
                // For checkboxes, display the checked values
                if ($(this).is(':checked')) {
                    value = $(this).val();
                    reviewContent += `<p><strong>${label}</strong> ${value}</p>`;
                }
            } else if ($(this).attr('type') === 'file') {
                // For file inputs, display the selected file name
                value = $(this)[0].files.length > 0 ? $(this)[0].files[0].name : 'No file chosen';
                reviewContent += `<p><strong>${label}</strong> ${value}</p>`;
            } else {
                // For other input types (text, email, etc.)
                value = $(this).val();
                reviewContent += `<p><strong>${label}</strong> ${value}</p>`;
            }
        });

        $(`#review-card-${step} .review-content`).html(reviewContent);
    }

    // Function to handle step transitions
    $(".next").click(function () {
        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        isValid = true; // reset validation flag
        current_fs.find(':input').each(function () {
            if (!this.checkValidity()) {
                isValid = false;
                $(this).addClass('invalid');
                $(this)[0].reportValidity();
            } else {
                $(this).removeClass('invalid');
            }
        });

        if (isValid) {
            populateReviewSection(current_fs.data('step'));

            // Add class active to the next step in the progress bar
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

            // Set current step to completed (add a checkmark)
            $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active").addClass("completed");

            // Show the next fieldset
            next_fs.show();
            current_fs.hide();
        }
    });

    $(".previous").click(function () {
        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        // Remove class active from the current step in the progress bar
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
        previous_fs.show();
        current_fs.hide();
    });

    // Handle edit button clicks in review section
    $(".edit-step").click(function () {
        let step = $(this).data('step');
        let target_fs = $(`fieldset[data-step='${step}']`);

        $('.review').hide();
        target_fs.show();
    });

    // On form submission, populate all review sections
    $("form").on("submit", function (event) {
        // event.preventDefault(); // prevent form submission for demo

        for (let step = 1; step <= 6; step++) {
            populateReviewSection(step);
        }

        // Show the review and submit section
        $("fieldset:last").show();
    });

    // Show or hide loan details based on current loans radio button
    $('input[name="current_loans"]').change(function() {
        if ($(this).val() === 'Yes') {
            $('#loan-details').show();
        } else {
            $('#loan-details').hide();
        }
    });
});
