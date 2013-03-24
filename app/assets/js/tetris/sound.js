/**
 * Handles the game's sound.
 *
 * Doesn't do anything if the browser doesn't support HTML5 Audio.
 */
define(['tetris/constants', 'tetris/storage'], function (Constants, Storage) {
    'use strict';

    var exports = {},
        audio,
        sound = Storage.get('sound') || false,
        $tetris = Constants.get('$TETRIS'),
        $sound = $tetris.find('.sound');


    // Dynamically insert the audio tag to avoid unwanted network requests.
    $tetris.append($tetris.find('.audio').html());
    audio = $tetris.find('audio').get(0);


    function renderButton() {
        if (sound) {
            $sound.attr('title', 'Disable sound');
            $sound.find('i')
                .removeClass('icon-volume-off')
                .addClass('icon-volume-up');
        } else {
            $sound.attr('title', 'Enable sound');
            $tetris.find('.sound i')
                .removeClass('icon-volume-up')
                .addClass('icon-volume-off');
        }
    }

    /**
     * Starts the sound.
     *
     * Doesn't necessarily cause sound to start *playing*, as the sound
     * preference could be disabled by the user.
     */
    function start() {
        if (!Modernizr.audio) {
            return;
        }

        if (sound) {
            audio.play();
        }
    }
    exports.start = start;

    /**
     * Stops the sound.
     */
    function stop() {
        if (!Modernizr.audio) {
            return;
        }

        if (sound) {
            audio.pause();
        }

        if (audio.currentTime > 0) {
            audio.currentTime = 0;
        }
    }
    exports.stop = stop;

    if (Modernizr.audio) {
        // Register sound preference toggle button.
        $sound.on('click', function () {
            if (sound) {
                sound = false;
                audio.pause();
            } else {
                sound = true;
                audio.play();
            }

            Storage.set('sound', sound);
            renderButton();
        });

        // Initial render of the sound button.
        renderButton();
    }


    return exports;
});
