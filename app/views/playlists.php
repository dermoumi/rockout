<div class="page-content v-playlists">
    <h1>Playlists</h1>
    <div class="pl-item">
        <h2><a href="<?php echo site_url('songs/show_list/all'); ?>" class="pl-title global nav-menu-item">
            <span class="left-border"></span>
            <span class="title"><span>All songs</span></span>
            <span class="right-border"></span>
        </a></h2>
        <div class="pl-content">
        
        </div>
    </div>
    <div class="pl-item">
        <h2><a href="<?php echo site_url('songs/show_list/recent'); ?>" class="pl-title nav-menu-item global">
            <span class="left-border"></span>
            <span class="title"><span>Recently played</span></span>
            <span class="right-border"></span>
        </a></h2>
        <div class="pl-content">

        </div>
    </div>
    <?php foreach($playlists as $playlist): ?>
    <div class="pl-item">
        <h2><a href="<?php echo site_url('songs/show_list/' . $playlist->id); ?>" class="pl-title nav-menu-item custom">
            <span class="left-border"></span>
            <span class="title"><span><?php echo $playlist->name ?></span></span>
            <span class="right-border"></span>
        </a></h2>
        <div class="pl-content">

        </div>
    </div>
    <?php endforeach; ?>
</div>

<script type="text/javascript">
    rkt.addPage('v-playlists');
</script>