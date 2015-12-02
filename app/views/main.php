<div class="page-content v-title">
    <div class="container">
        <div class="userbar">
            <?php if ($userrank > 0): ?>
            Welcome, connected as <?php echo anchor('user/profile/' + $userid, $username, 'class="slider"'); ?>
            (<?php echo anchor('user/logout', 'Logout', 'class="slider"')?>)
            <?php else: ?>
            <?php echo anchor('user/login', lang('main_login'), 'class="slider"'); ?>
            | <?php echo anchor('user/register', lang('main_register'), 'class="slider"'); ?>
        <?php endif; ?>
        </div>

        <div class="logo-container">
            <img src="<?=base_url('assets/img/logo.png')?>" alt="<?=lang('main_sitename')?>">
        </div>

        <ul class="nav-menu">
            <li>
                <?=anchor('playlists', lang('title_select'), 'class="nav-menu-item slider"')?>
            </li>
            <?php if ($userrank >= RKT_CREATOR) : ?>
            <li>
                <?=anchor('songs/create', lang('title_create'), 'class="nav-menu-item slider"')?>
            </li>
            <?php endif; ?>
            <li>
                <?=anchor('settings', lang('title_settings'), 'class="nav-menu-item slider"')?>
            </li>
        </ul>

        <div class="bottom-links">
            <?=anchor('about', lang('title_about'), 'class="slider"')?>
            | <?=anchor('about/disclaimer', lang('title_disclaimer'), 'class="slider"')?>
            | <?=anchor('about/faq', lang('title_faq_abbr'), 'class="slider"')?>
            | <?=anchor('about/lang_select', lang('title_language'), 'class="slider"')?>
        </div>
        <div class="control-tip"></div>
    </div>
</div>


<script type="text/javascript">
    rkt.addPage('v-title');
</script>