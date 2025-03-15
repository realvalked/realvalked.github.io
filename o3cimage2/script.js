document.getElementById('imageInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (file.type === 'image/gif') {
                handleGIF(e.target.result);
            } else {
                handleImage(e.target.result);
            }
        };
        reader.onerror = function () {
            console.error("Failed to read the file.");
            alert("Failed to read the file. Please try again.");
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please upload a valid image or GIF file.");
    }
});

function handleImage(imageData) {
    const img = new Image();
    img.onload = function () {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the image onto the canvas, resized to 160x80
        ctx.drawImage(img, 0, 0, 160, 80);

        // Enable the download button
        document.getElementById('downloadButton').disabled = false;

        // Set up download functionality
        setupDownload(canvas, 'resized-image.jpg');
    };
    img.src = imageData;
}

function handleGIF(gifData) {
    const gif = new SuperGif({ gif: gifData });
    gif.load(() => {
        const frames = gif.frames;
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const progressBar = document.getElementById('progressBar');

        // Create a new GIF instance
        const resizedGIF = new GIF({
            workers: 2,
            quality: 10,
            width: 160,
            height: 80,
        });

        // Update progress bar
        progressBar.value = 0;
        progressBar.max = frames.length;

        // Process each frame
        frames.forEach((frame, index) => {
            const img = frame.image;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, 160, 80);

            // Add the resized frame to the new GIF
            resizedGIF.addFrame(ctx, { copy: true, delay: frame.delay });

            // Update progress bar
            progressBar.value = index + 1;
        });

        // Finalize the GIF
        resizedGIF.on('finished', function (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'resized-gif.gif';
            link.click();
            URL.revokeObjectURL(url);

            // Reset progress bar
            progressBar.value = 0;
        });

        resizedGIF.render();
    });
}

function setupDownload(canvas, fileName) {
    document.getElementById('downloadButton').addEventListener('click', function () {
        // Compress the image (quality: 0.8 for 80% quality)
        const compressedDataURL = canvas.toDataURL('image/jpeg', 0.8);

        // Create a download link
        const link = document.createElement('a');
        link.download = fileName;
        link.href = compressedDataURL;
        link.click();
    });
}
