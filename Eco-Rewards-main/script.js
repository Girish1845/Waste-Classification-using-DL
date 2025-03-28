// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Progress and stats elements
    const progressBar = document.getElementById('progress-bar');
    const pointsDisplay = document.getElementById('points-display');
    const treesPlanted = document.getElementById('trees-planted');
    const tonsRecycled = document.getElementById('tons-recycled');
    const participants = document.getElementById('participants');
    
    // Navigation and menu elements
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const claimBtn = document.querySelector('.claim-btn');
    const rewardCards = document.querySelectorAll('.reward-card');
    
    // User data
    let userData = {
        points: 0,
        level: 'Beginner',
        activities: []
    };
    
    // Initialize stats with animation
    initStats();
    
    // Add mobile menu toggle
    menuToggle.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // Add event listeners to reward cards
    rewardCards.forEach(card => {
        card.addEventListener('click', () => {
            const activity = card.querySelector('h3').textContent;
            const pointsText = card.querySelector('.points').textContent;
            const points = parseInt(pointsText.replace(/[^0-9]/g, ''));
            
            addPoints(points, activity);
            showNotification(`+${points} points for ${activity}!`);
        });
    });
    
    // Claim rewards button
    claimBtn.addEventListener('click', () => {
        if (userData.points < 100) {
            showNotification("You need at least 100 points to claim rewards.");
        } else {
            showRewardsModal();
        }
    });
    
    // Add waste classification section to the page
    addWasteClassificationSection();
    
    // Functions
    function addPoints(points, activity) {
        userData.points += points;
        userData.activities.push({
            activity: activity,
            points: points,
            date: new Date().toISOString()
        });
        
        // Update points display
        pointsDisplay.textContent = `${userData.points} points`;
        
        // Update progress bar (max 1000 points)
        const progressPercentage = Math.min((userData.points / 1000) * 100, 100);
        progressBar.style.width = `${progressPercentage}%`;
        
        // Update user level
        updateUserLevel();
        
        // Store user data
        localStorage.setItem('ecoRewardsUserData', JSON.stringify(userData));
    }
    
    function updateUserLevel() {
        const levels = [
            { name: 'Beginner', threshold: 0 },
            { name: 'Explorer', threshold: 250 },
            { name: 'Guardian', threshold: 500 },
            { name: 'Champion', threshold: 750 }
        ];
        
        // Find current level
        for (let i = levels.length - 1; i >= 0; i--) {
            if (userData.points >= levels[i].threshold) {
                if (userData.level !== levels[i].name) {
                    userData.level = levels[i].name;
                    showNotification(`Congratulations! You've reached ${userData.level} level!`);
                }
                
                // Update level dots
                document.querySelectorAll('.level-dot').forEach((dot, index) => {
                    if (index <= i) {
                        dot.style.backgroundColor = 'var(--secondary-color)';
                    } else {
                        dot.style.backgroundColor = '#e0e0e0';
                    }
                });
                
                break;
            }
        }
    }
    
    function initStats() {
        // Load user data from storage
        const storedData = localStorage.getItem('ecoRewardsUserData');
        if (storedData) {
            userData = JSON.parse(storedData);
            pointsDisplay.textContent = `${userData.points} points`;
            
            // Update progress bar
            const progressPercentage = Math.min((userData.points / 1000) * 100, 100);
            progressBar.style.width = `${progressPercentage}%`;
            
            // Update level dots
            updateUserLevel();
        }
        
        // Animate stats counters
        animateCounter(treesPlanted, 10000);
        animateCounter(tonsRecycled, 5680);
        animateCounter(participants, 25000);
    }
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = Math.ceil(target / 100);
        const interval = 30;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }
            element.textContent = current.toLocaleString();
        }, interval);
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = 'var(--border-radius)';
        notification.style.boxShadow = 'var(--shadow)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.3s ease';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    function showRewardsModal() {
        const rewards = [
            { name: 'Eco-friendly Water Bottle', points: 100, image: '/api/placeholder/200/200' },
            { name: 'Reusable Shopping Bag Set', points: 150, image: '/api/placeholder/200/200' },
            { name: 'Tree Planting Certificate', points: 200, image: '/api/placeholder/200/200' },
            { name: '10% Discount at Eco Store', points: 300, image: '/api/placeholder/200/200' },
            { name: 'Solar Power Bank', points: 500, image: '/api/placeholder/200/200' }
        ];
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'rewards-modal';
        
        // Style the modal
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '30px';
        modalContent.style.borderRadius = 'var(--border-radius)';
        modalContent.style.maxWidth = '800px';
        modalContent.style.width = '90%';
        modalContent.style.maxHeight = '80vh';
        modalContent.style.overflow = 'auto';
        
        // Add heading
        const heading = document.createElement('h2');
        heading.textContent = 'Available Rewards';
        heading.style.color = 'var(--primary-color)';
        heading.style.marginBottom = '20px';
        modalContent.appendChild(heading);
        
        // Add points info
        const pointsInfo = document.createElement('p');
        pointsInfo.textContent = `Your current points: ${userData.points}`;
        pointsInfo.style.fontSize = '1.2rem';
        pointsInfo.style.marginBottom = '30px';
        modalContent.appendChild(pointsInfo);
        
        // Add rewards grid
        const rewardsGrid = document.createElement('div');
        rewardsGrid.style.display = 'grid';
        rewardsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        rewardsGrid.style.gap = '20px';
        
        // Add rewards
        rewards.forEach(reward => {
            const rewardItem = document.createElement('div');
            rewardItem.style.border = '1px solid #e0e0e0';
            rewardItem.style.borderRadius = 'var(--border-radius)';
            rewardItem.style.padding = '15px';
            rewardItem.style.textAlign = 'center';
            rewardItem.style.transition = 'var(--transition)';
            
            if (userData.points >= reward.points) {
                rewardItem.style.cursor = 'pointer';
                rewardItem.addEventListener('mouseenter', () => {
                    rewardItem.style.transform = 'translateY(-5px)';
                    rewardItem.style.boxShadow = 'var(--shadow)';
                });
                rewardItem.addEventListener('mouseleave', () => {
                    rewardItem.style.transform = 'translateY(0)';
                    rewardItem.style.boxShadow = 'none';
                });
                rewardItem.addEventListener('click', () => {
                    redeemReward(reward);
                    document.body.removeChild(modal);
                });
            } else {
                rewardItem.style.opacity = '0.6';
            }
            
            const img = document.createElement('img');
            img.src = reward.image;
            img.alt = reward.name;
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = 'var(--border-radius)';
            img.style.marginBottom = '10px';
            rewardItem.appendChild(img);
            
            const name = document.createElement('h3');
            name.textContent = reward.name;
            name.style.fontSize = '1rem';
            name.style.marginBottom = '10px';
            rewardItem.appendChild(name);
            
            const points = document.createElement('span');
            points.textContent = `${reward.points} points`;
            points.style.display = 'inline-block';
            points.style.backgroundColor = 'var(--accent-color)';
            points.style.padding = '5px 10px';
            points.style.borderRadius = '20px';
            points.style.fontSize = '0.9rem';
            rewardItem.appendChild(points);
            
            rewardsGrid.appendChild(rewardItem);
        });
        
        modalContent.appendChild(rewardsGrid);
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'secondary-btn';
        closeButton.style.marginTop = '30px';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        modalContent.appendChild(closeButton);
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }
    
    function redeemReward(reward) {
        // Subtract points
        userData.points -= reward.points;
        pointsDisplay.textContent = `${userData.points} points`;
        
        // Update progress bar
        const progressPercentage = Math.min((userData.points / 1000) * 100, 100);
        progressBar.style.width = `${progressPercentage}%`;
        
        // Update user level
        updateUserLevel();
        
        // Store user data
        localStorage.setItem('ecoRewardsUserData', JSON.stringify(userData));
        
        // Show confirmation
        showNotification(`You've redeemed ${reward.name}!`);
    }
    
    function addWasteClassificationSection() {
        // Create the waste classification section
        const section = document.createElement('section');
        section.className = 'waste-classification';
        section.style.padding = '80px 40px';
        section.style.backgroundColor = 'var(--light-color)';
        section.style.textAlign = 'center';
        
        // Add heading
        const heading = document.createElement('h2');
        heading.textContent = 'WASTE CLASSIFICATION';
        heading.style.fontSize = '2.5rem';
        heading.style.color = 'var(--primary-color)';
        heading.style.marginBottom = '50px';
        heading.style.position = 'relative';
        heading.style.display = 'inline-block';
        
        // Add heading decoration
        const headingDecoration = document.createElement('span');
        headingDecoration.style.position = 'absolute';
        headingDecoration.style.bottom = '-10px';
        headingDecoration.style.left = '50%';
        headingDecoration.style.transform = 'translateX(-50%)';
        headingDecoration.style.width = '80px';
        headingDecoration.style.height = '4px';
        headingDecoration.style.backgroundColor = 'var(--secondary-color)';
        headingDecoration.style.borderRadius = '2px';
        heading.appendChild(headingDecoration);
        
        section.appendChild(heading);
        
        // Add description
        const description = document.createElement('p');
        description.textContent = 'Upload an image of waste and our AI will classify it and suggest how to properly dispose of it.';
        description.style.maxWidth = '800px';
        description.style.margin = '0 auto 40px';
        description.style.fontSize = '1.1rem';
        section.appendChild(description);
        
        // Create upload container
        const uploadContainer = document.createElement('div');
        uploadContainer.className = 'upload-container';
        uploadContainer.style.maxWidth = '600px';
        uploadContainer.style.margin = '0 auto';
        uploadContainer.style.backgroundColor = 'white';
        uploadContainer.style.borderRadius = 'var(--border-radius)';
        uploadContainer.style.padding = '30px';
        uploadContainer.style.boxShadow = 'var(--shadow)';
        
        // Create upload area
        const uploadArea = document.createElement('div');
        uploadArea.className = 'upload-area';
        uploadArea.style.border = '2px dashed var(--primary-color)';
        uploadArea.style.borderRadius = 'var(--border-radius)';
        uploadArea.style.padding = '40px';
        uploadArea.style.textAlign = 'center';
        uploadArea.style.marginBottom = '20px';
        uploadArea.style.cursor = 'pointer';
        uploadArea.style.transition = 'var(--transition)';
        
        // Add upload icon
        const uploadIcon = document.createElement('i');
        uploadIcon.className = 'fas fa-cloud-upload-alt';
        uploadIcon.style.fontSize = '3rem';
        uploadIcon.style.color = 'var(--primary-color)';
        uploadIcon.style.marginBottom = '15px';
        uploadArea.appendChild(uploadIcon);
        
        // Add upload text
        const uploadText = document.createElement('p');
        uploadText.textContent = 'Drag & drop an image or click to browse';
        uploadText.style.fontSize = '1.1rem';
        uploadArea.appendChild(uploadText);
        
        // Add file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        uploadArea.appendChild(fileInput);
        
        // Add event listeners for upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = 'rgba(46, 125, 50, 0.1)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.backgroundColor = 'transparent';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = 'transparent';
            if (e.dataTransfer.files.length) {
                handleImageUpload(e.dataTransfer.files[0]);
            }
        });
        
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) {
                handleImageUpload(fileInput.files[0]);
            }
        });
        
        uploadContainer.appendChild(uploadArea);
        
        // Create preview container
        const previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container';
        previewContainer.style.display = 'none';
        previewContainer.style.marginTop = '30px';
        
        // Create image preview
        const imagePreview = document.createElement('div');
        imagePreview.className = 'image-preview';
        imagePreview.style.marginBottom = '20px';
        
        const previewImage = document.createElement('img');
        previewImage.style.maxWidth = '100%';
        previewImage.style.maxHeight = '300px';
        previewImage.style.borderRadius = 'var(--border-radius)';
        previewImage.style.boxShadow = 'var(--shadow)';
        imagePreview.appendChild(previewImage);
        
        previewContainer.appendChild(imagePreview);
        
        // Create classification result
        const resultContainer = document.createElement('div');
        resultContainer.className = 'result-container';
        resultContainer.style.backgroundColor = 'var(--gray)';
        resultContainer.style.padding = '20px';
        resultContainer.style.borderRadius = 'var(--border-radius)';
        
        const resultTitle = document.createElement('h3');
        resultTitle.textContent = 'Classification Result';
        resultTitle.style.marginBottom = '15px';
        resultTitle.style.color = 'var(--primary-color)';
        resultContainer.appendChild(resultTitle);
        
        const resultText = document.createElement('p');
        resultText.className = 'result-text';
        resultText.style.fontSize = '1.1rem';
        resultText.style.marginBottom = '15px';
        resultContainer.appendChild(resultText);
        
        const disposalTitle = document.createElement('h4');
        disposalTitle.textContent = 'How to Dispose:';
        disposalTitle.style.marginTop = '15px';
        disposalTitle.style.marginBottom = '10px';
        resultContainer.appendChild(disposalTitle);
        
        const disposalText = document.createElement('p');
        disposalText.className = 'disposal-text';
        resultContainer.appendChild(disposalText);
        
        // Add buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '20px';
        
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Upload Another';
        resetButton.className = 'secondary-btn';
        resetButton.addEventListener('click', () => {
            previewContainer.style.display = 'none';
            uploadArea.style.display = 'block';
            fileInput.value = '';
        });
        
        const earnButton = document.createElement('button');
        earnButton.textContent = 'Earn Points';
        earnButton.className = 'primary-btn';
        earnButton.addEventListener('click', () => {
            // Add points for recycling
            addPoints(15, 'Waste Classification');
            showNotification('You earned 15 points for classifying waste!');
            previewContainer.style.display = 'none';
            uploadArea.style.display = 'block';
            fileInput.value = '';
        });
        
        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(earnButton);
        resultContainer.appendChild(buttonContainer);
        
        previewContainer.appendChild(resultContainer);
        uploadContainer.appendChild(previewContainer);
        section.appendChild(uploadContainer);
        
        // Add the section to the main content
        const mainContent = document.querySelector('main');
        mainContent.appendChild(section);
    }
    
    function handleImageUpload(file) {
        // Show spinner while "processing"
        const uploadArea = document.querySelector('.upload-area');
        uploadArea.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--primary-color);"></i><p>Analyzing image...</p>';
        
        // Create a FileReader to read the image
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Set the preview image source
            const previewImage = document.querySelector('.image-preview img');
            previewImage.src = e.target.result;
            
            // Simulate AI classification (in reality this would call an API)
            setTimeout(() => {
                classifyWaste(file.name);
                
                // Hide upload area and show preview
                uploadArea.style.display = 'none';
                document.querySelector('.preview-container').style.display = 'block';
                
                // Reset upload area for next time
                uploadArea.innerHTML = `
                    <i class="fas fa-cloud-upload-alt" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 15px;"></i>
                    <p style="font-size: 1.1rem;">Drag & drop an image or click to browse</p>
                `;
            }, 2000);  // 2 second delay to simulate processing
        };
        
        reader.readAsDataURL(file);
    }
    
    function classifyWaste(filename) {
        // This is a simplified simulation of waste classification
        // In a real application, this would call an API for image analysis
        
        const wasteTypes = [
            {
                type: 'Plastic Bottle',
                category: 'Recyclable',
                disposal: 'Place in the blue recycling bin. Make sure it\'s empty and clean. Remove the cap and label if possible.'
            },
            {
                type: 'Food Waste',
                category: 'Compostable',
                disposal: 'Place in green compost bin or home composting system. Avoid meat and dairy if home composting.'
            },
            {
                type: 'Paper',
                category: 'Recyclable',
                disposal: 'Place in blue recycling bin. Remove any plastic or metal attachments. Shred confidential documents first.'
            },
            {
                type: 'Electronic Waste',
                category: 'Special Disposal',
                disposal: 'Take to an e-waste recycling center. These contain valuable materials and harmful substances that need proper handling.'
            },
            {
                type: 'Glass Bottle',
                category: 'Recyclable',
                disposal: 'Place in the blue recycling bin. Make sure it\'s empty and clean. Remove the cap if it\'s made of a different material.'
            }
        ];
        
        // Randomly select a waste type for demonstration
        // In a real app, this would be determined by image analysis
        const randomIndex = Math.floor(Math.random() * wasteTypes.length);
        const classification = wasteTypes[randomIndex];
        
        // Display the result
        document.querySelector('.result-text').textContent = 
            `This appears to be: ${classification.type} (${classification.category})`;
        document.querySelector('.disposal-text').textContent = classification.disposal;
        
        // Add a specific class for styling based on category
        const resultContainer = document.querySelector('.result-container');
        resultContainer.className = 'result-container';  // Reset classes
        resultContainer.classList.add(classification.category.toLowerCase().replace(' ', '-'));
        
        // Add some color coding based on category
        if (classification.category === 'Recyclable') {
            resultContainer.style.borderLeft = '5px solid var(--primary-color)';
        } else if (classification.category === 'Compostable') {
            resultContainer.style.borderLeft = '5px solid var(--secondary-color)';
        } else {
            resultContainer.style.borderLeft = '5px solid var(--accent-color)';
        }
    }
});