$(document).ready(function () {
    const categories = ["headBoy", "headGirl", "generalCaptain", "generalViceCaptain"];
    const selectedFieldMap = {
        headBoy: "#selectedHeadBoy",
        headGirl: "#selectedHeadGirl",
        generalCaptain: "#selectedGeneralCaptain",
        generalViceCaptain: "#selectedGeneralViceCaptain"
    };
    const hiddenValueMap = {
        headBoy: "#valueHeadBoy",
        headGirl: "#valueHeadGirl",
        generalCaptain: "#valueGeneralCaptain",
        generalViceCaptain: "#valueGeneralViceCaptain"
    };
    const $submitBtn = $('.submit-btn');
    const $progressBar = $('#voteProgressBar');
    const $progressText = $('#voteProgressText');

    // Disable submit button initially
    $submitBtn.prop('disabled', true);

    // Handle candidate card selection
    $('.selectable').on('click', function () {
        const position = $(this).data("position");
        const candidateName = $(this).find("h3").text().trim();

        // Remove selected class from other cards in the same position
        $(`[data-position="${position}"]`).removeClass('selected');

        // Add selected class to clicked card
        $(this).addClass('selected');

        // Check the hidden radio button
        $(this).find('input[type="radio"]').prop('checked', true);

        // Reflect selected candidate in the summary text fields and hidden submission fields
        $(selectedFieldMap[position]).val(candidateName);
        $(hiddenValueMap[position]).val(candidateName);

        // Check if all categories have a selection
        checkFormValidity();
    });

    // Function to check if form is valid (all categories have selections)
    function checkFormValidity() {
        let allSelected = true;
        let selectedCount = 0;

        for (let category of categories) {
            const isSelected = $(`input[name="${category}"]:checked`).length > 0;
            if (!isSelected) {
                allSelected = false;
            } else {
                selectedCount += 1;
            }
        }

        const progressPercent = (selectedCount / categories.length) * 100;
        const progressHue = 30 + ((selectedCount / categories.length) * 90);
        const progressColor = `hsl(${progressHue}, 85%, 45%)`;
        $progressBar.css('width', `${progressPercent}%`);
        $progressBar.css('background-color', progressColor);
        $progressText.text(`${selectedCount}/${categories.length}`);

        // Enable/disable submit button based on validation
        $submitBtn.prop('disabled', !allSelected);
    }

    // Initialize progress state on load
    checkFormValidity();

    // Handle form submission
    $("#votingForm").on("submit", function (e) {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }
    });

    // Function to validate form
    function validateForm() {
        for (let category of categories) {
            const isSelected = $(`input[name="${category}"]:checked`).length > 0;
            if (!isSelected) {
                alert(`Please select a candidate for ${formatCategoryName(category)}`);
                return false;
            }
        }
        return true;
    }

    // Helper function to format category names for display
    function formatCategoryName(category) {
        const names = {
            'headBoy': 'Head Boy',
            'headGirl': 'Head Girl',
            'generalCaptain': 'General Captain',
            'generalViceCaptain': 'General Vice-Captain'
        };
        return names[category];
    }
});

