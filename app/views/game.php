<div class="page-content v-game">
    <div class="wrapper">
        <div class="subwrapper">
            <div id="vd-container" class="container">
                <div id="video-player"></div>
                <div id="video-mask"></div>
                <div id="neck-canvas-wrapper">
                    <canvas id="neck-canvas"></canvas>
                </div>
                <div id="back-canvas-wrapper">
                    <canvas id="back-canvas"></canvas>
                </div>
                <div id="stage-canvas-wrapper">
                    <canvas id="stage-canvas"></canvas>
                </div>
                <div id="hud-canvas-wrapper">
                    <canvas id="hud-canvas"></canvas>
                </div>
                <div id="pause-screen"></div>
                <div id="dim-screen"></div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    rkt.addPage('v-game', '<?php echo $song_data; ?>');
</script>