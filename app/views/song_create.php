<div class="page-content v-song-create">
    <h1><?php echo lang('song_create');?></h1>
    <?php echo form_open('song/create', array('class' => 'create-song-form')); ?>
        <div class="nav-menu-item text-input">
            <label for="title"><?php echo lang('song_title');?></label>
            <input type="text" name="title" id="title" value="<?php echo set_value('title'); ?>"></input>
            <?php echo form_error('title'); ?>
        </div>
        <div class="nav-menu-item text-input">
            <label for="artist"><?php echo lang('song_artist');?></label>
            <input type="text" name="artist" id="artist" value="<?php echo set_value('artist'); ?>"></input>
            <?php echo form_error('artist'); ?>
        </div>
        <div class="nav-menu-item text-input">
            <label for="vurl"><?php echo lang('song_vid_url');?></label>
            <input type="text" name="vurl" id="vurl" value="<?php echo set_value('vurl'); ?>"></input>
            <?php echo form_error('vurl'); ?>
        </div>
        <div class="submit-wrapper">
            <input class="nav-menu-item submit-button" type="submit" value="<?php echo lang('song_create_go');?>"></input>
        </div>
    </form>
</div>

<script type="text/javascript">
    rkt.addPage('v-song-create');
</script>