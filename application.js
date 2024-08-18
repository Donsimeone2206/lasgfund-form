$(document).ready(function () {
    var current_fs, next_fs, previous_fs; // fieldsets
    var opacity;
    var isValid;

    // Function to validate required fields in the current fieldset
    function validateCurrentFieldset() {
        isValid = true;
        current_fs.find('input, select, textarea').each(function () {
            var $this = $(this);
            $this.removeClass('error'); // Remove previous error class

            if ($this.prop('required') && !$this.val()) {
                $this.addClass('error');
                isValid = false;
            }

            if ($this.attr('name') === 'contact_number' || $this.attr('name') === 'guarantor_contact_number') {
                var contact_number = $this.val();
                if (!/^\d{11}$/.test(contact_number)) {
                    $this.addClass('error');
                    isValid = false;
                }
            }

            if ($this.attr('name') === 'email' || $this.attr('name') === 'guarantor_email') {
                var email = $this.val();
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    $this.addClass('error');
                    isValid = false;
                }
            }
        });
        return isValid;
    }

    $(".next").click(function () {
        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        if (validateCurrentFieldset()) {
            alert("Please fill all required fields correctly.");
            return false;
        }

        // If the next step is the Submit Application step, display the review data
        if ($(next_fs).find("#review-data").length > 0) {
            var formData = {};
            $('#msform').find('input, select, textarea').each(function () {
                var name = $(this).attr('name');
                var value;
                var label;
    
                // Get the value and label for file inputs
                if ($(this).attr('type') === 'file') {
                    value = $(this)[0].files.length > 0 ? $(this)[0].files[0].name : 'No file chosen';
                    label = $(this).closest('.input-group').find('label').text();
                }
                // Get the value and label for radio inputs
                else if ($(this).attr('type') === 'radio') {
                    if ($(this).is(':checked')) {
                        value = $(this).val();
                        label = $(this).closest('.input-group').find('label.fieldlabels').text();
                    }
                }
                // Get the value and label for checkboxes
                else if ($(this).attr('type') === 'checkbox') {
                    if ($(this).is(':checked')) {
                        value = $(this).val();
                        label = $(this).closest('.input-group').find('label.fieldlabels').text();
                    }
                }
                // Get the value and label for select elements
                else if ($(this).is('select')) {
                    value = $(this).val();
                    label = $(this).closest('.input-group').find('label.fieldlabels').text();
                }
                // For other input types (text, email, etc.)
                else {
                    value = $(this).val();
                    label = $(this).closest('.input-group').find('label.fieldlabels').text();
                }
    
                if (label && value) {
                    formData[label] = value;
                }
            });
    
            // Display the review data
            var reviewHtml = '<ol>';
            $.each(formData, function (key, value) {
                reviewHtml += '<li><strong>' + key + '</strong>: ' + value + '</li>';
            });
            reviewHtml += '</ol>';
            $('#review-data').html(reviewHtml);
        }

        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
        next_fs.show();

        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                opacity = 1 - now;
                current_fs.css({ 'display': 'none', 'position': 'relative' });
                next_fs.css({ 'opacity': opacity });
            },
            duration: 600
        });
    });

    $(".previous").click(function () {
        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
        previous_fs.show();

        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                opacity = 1 - now;
                current_fs.css({ 'display': 'none', 'position': 'relative' });
                previous_fs.css({ 'opacity': opacity });
            },
            duration: 600
        });
    });

    $("input[type='submit']").click(function () {
        // Optionally validate one last time before submission
        if (validateCurrentFieldset()) {
            alert("Please fill all required fields correctly.");
            return false; // Prevent form submission
        }

        // Submit the form
        alert("Loan application submitted successfully");
        return true; // Allow the form to be submitted
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
