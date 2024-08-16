# ChallengePixels

**ChallengePixels**: where unlocking premium images isn't just a click away—it's an adventure! We've all been there, scrolling through so-called "FREE" stock image sites only to be bombarded with sign-up forms, upsells, and hidden fees. But not here! **ChallengePixels** is genuinely free with one fun twist: you've got to **earn** the images you want.

Once you've conquered our challenge, you'll be able to download the image in our soon-to-be-legendary (and completely made-up) file format: **MEME**—**Magnificently Eccentric Media Encapsulation Format**. (Seriously, it's totally a thing... maybe.) Wondering how to open this majestic format? Don't worry, we’ve got you covered! Check out the instructions [here](https://github.com/adityakotha03/meme?tab=readme-ov-file#how-to-use-the-meme-files).

Below, you'll find videos that show you how to access the images and crack open our **.MEME** files to reveal your well-earned treasure. **Scroll down for more hilarious tutorials—because who said tech can't be fun?**

## Demo
![demo](assets/web_demo.gif)

---

![demo](assets/meme.gif)

## Installation Locally

1. Clone the repository:
    ```bash
    git clone https://github.com/adityakotha03/meme.git
    ```

2. Navigate to the project directory:
    ```bash
    cd meme
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Start the application:
    ```bash
    npm start
    ```

## How to Use the .meme Files

1. Navigate to the Python directory:
    ```bash
    cd Python
    ```

2. Ensure you have Python 3.7 or greater installed.

3. Install the required Python packages:
    ```bash
    pip install Pillow pygame pyinstaller
    ```

4. To create an executable file, run:
    ```bash
    pyinstaller --onefile meme_handler.py
    ```

### Using the .meme Files on Windows

1. Double-click on a `.meme` file using your File Explorer.
2. Click on **More Apps** (see image below).

   ![More Apps](assets/look_for_apps.png)

3. Click on **Look for another app on this PC** (see image below).

   ![Look for another app on this PC](assets/more_apps.png)

4. Navigate to the directory where you cloned the repository. Inside the `Python` folder, open the `dist` directory and select `meme_handler.exe`.

    > **Note:** The `dist` folder is created after you run `pyinstaller --onefile meme_handler.py`.

### Using the .meme Files on Mac or Linux

For Mac or Linux users, you can use the `meme.py` script located inside the `Python` folder. This script provides functions for encoding and decoding images, allowing you to access the `.meme` files.

We have also provided a sample image inside the `Python/sample` directory for you to try out.

Once you finish the game, the images are automatically saved to the path where the original `.meme` file is located.

---

Feel free to reach out if you encounter any issues or have any questions in the [Discussions](https://github.com/adityakotha03/meme/discussions)!

Enjoy the journey, embrace the challenges, and remember: in the world of **ChallengePixels**, nothing is free... except everything, if you're up for the challenge!
