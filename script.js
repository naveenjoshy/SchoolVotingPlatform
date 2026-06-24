$(document).ready(function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch((error) => {
            console.error('Service worker registration failed:', error);
        });
    }

    // Color bomb confetti effect function
    function createColorBombEffect() {
        const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D', '#FF9800', '#81c784'];
        const particleCount = 350;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < particleCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            // Random color from the bomb palette
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.backgroundColor = randomColor;

            // Set starting position (center)
            confetti.style.left = centerX + 'px';
            confetti.style.top = centerY + 'px';

            // Calculate random direction (full 360 degrees)
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5);
            const velocity = 150 + Math.random() * 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            // Set CSS variables for the burst animation
            confetti.style.setProperty('--tx', tx + 'px');
            confetti.style.setProperty('--ty', ty + 'px');

            document.body.appendChild(confetti);

            // Add animation class with a small delay to ensure reflow
            setTimeout(() => {
                confetti.classList.add('animate');
            }, 10);
        }
    }

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

    let votingSubmitted = false;

    // Handle candidate card selection
    $('.selectable').on('click', function () {
        if (votingSubmitted) return;

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
        const progressColors = ['#FF0000', '#FF8800', '#FFFF00', '#66BB6A'];
        const progressColor = progressColors[selectedCount - 1] || '#E0E0E0';
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

        // Prevent multiple submissions
        if (votingSubmitted) return;
        votingSubmitted = true;
        $submitBtn.prop('disabled', true);

        // Make AJAX call to submit vote
        $.ajax({
            url: "https://script.google.com/macros/s/AKfycbw9qB9xRuj2L05GBgu0UGQUmxVOxD8hasPknSOq3NIZ-muwspN1PC4CQuCEdqf9OuXa/exec",
            data: {
                headBoy: $("#valueHeadBoy").val(),
                headGirl: $("#valueHeadGirl").val(),
                generalCaptain: $("#valueGeneralCaptain").val(),
                generalViceCaptain: $("#valueGeneralViceCaptain").val()
            },
            method: "post",
            success: function (response) {
                console.log("Vote submitted successfully!");
                
                // Play success audio briefly
                const successAudio = document.getElementById('successAudio');
                if (successAudio) {
                    successAudio.currentTime = 0;
                    successAudio.play().catch(() => {
                        // Ignore autoplay blocks in restricted browsers
                    });
                    setTimeout(() => {
                        successAudio.pause();
                        successAudio.currentTime = 0;
                    }, 1500);
                }

                // Disable the form
                $('#votingForm').addClass('form-disabled');
                $('.selectable').addClass('form-disabled');
                $('.candidate-panel').addClass('form-disabled');

                // Create color bomb effect immediately
                console.log("Creating color bomb effect...");
                createColorBombEffect();

                // Show success overlay immediately
                console.log("Showing success overlay...");
                $('#successOverlay').addClass('show');
            },
            error: function (err) {
                console.log("Error:", err);
                // Re-enable submission on error so the user can retry
                votingSubmitted = false;
                $submitBtn.prop('disabled', false);
            }
        });
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

