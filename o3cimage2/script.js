document.getElementById('imageInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type === 'image/gif') {
        const reader = new FileReader();
        reader.onload = function (e) {
            handleGIF(e.target.result);
        };
        reader.onerror = function () {
            console.error("Failed to read the file.");
            alert("Failed to read the file. Please try again.");
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please upload a valid GIF file.");
    }
});

function handleGIF(gifData) {
    const gif = new SuperGif({ gif: gifData });
    gif.load(() => {
        const frames = gif.frames;
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Create a new GIF instance
        const resizedGIF = new GIF({
            workers: 2,
            quality: 10,
            width: 160,
            height: 80,
        });

        // Process each frame
        frames.forEach((frame, index) => {
            const img = frame.image;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, 160, 80);

            // Add the resized frame to the new GIF
            resizedGIF.addFrame(ctx, { copy: true, delay: frame.delay });
        });

        // Finalize the GIF
        resizedGIF.on('finished', function (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'resized-gif.gif';
            link.click();
            URL.revokeObjectURL(url);
        });

        resizedGIF.render();
    });
}
