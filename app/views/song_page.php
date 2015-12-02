<div class="page-content v-song">
    <h1>Song</h1>
    <div class="metadata">
        Song title: <?php echo $song->title ?><br/>
        Song artist: <?php echo $song->artist ?><br/>
        Song BPM: <?php echo $song->bpm ?><br/>
        Song video id: <?php echo $song->video_id ?><br/>
        Song difficulty: <?php echo $song->difficulty ?><br/>
        Song Duration: <?php echo $song->duration ?><br/>
        Song State: <?php echo $song->state ?><br/>
        Song Rating: <?php echo $song->rating ?><br/>
        Song Fretter's ID: <?php echo $song->fretter_id ?><br/>
        Song play count: <?php echo $song->play_count ?><br/>
        Song date created: <?php echo $song->date_created ?><br/>
        <a href="<?php echo site_url('runtime/game/'.$song->id.'/'.RKT_MODE_EDIT); ?>" class="slider">Edit</a>
    </div>
    <div class="buttons">
        <a href="<?php echo site_url('runtime/game/'.$song->id.'/'.RKT_PLAY_STRUM) ?>" class="play strummode nav-menu-item slider">
            <span class="title">Strum mode</span>
            <?php if ($strum_score): ?>
            <span class="score-meta">
                <span class="score-caption">High-Score:</span>
                <span class="score"><?php echo $strum_score->score; ?></span>
                <span class="scorer"><?php echo $strum_score->username; ?></span>
            </span>
            <?php endif; ?>
        </a>
        <a href="<?php echo site_url('runtime/game/'.$song->id.'/'.RKT_PLAY_TAP) ?>" class="play tapmode nav-menu-item slider">
            <span class="title">Tap mode</span>
            <?php if ($tap_score): ?>
            <span class="score-meta">
                <span class="score-caption">High-Score:</span>
                <span class="score"><?php echo $tap_score->score; ?></span>
                <span class="scorer"><?php echo $tap_score->username; ?></span>
            </span>
            <?php endif; ?>
        </a>
    </div>
</div>

<script type="text/javascript">
    rkt.addPage('v-song');
</script>