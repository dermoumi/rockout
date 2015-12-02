<div class="page-content v-login">
    <h1><?php echo lang('user_login');?></h1>
    <?php echo form_open('user/login', array('class' => 'login-form')); ?>
        <?php if (isset($login_failed) && $login_failed) : ?>
        <div class="error-box">Wrong username or password, please try again</div>
        <?php endif; ?>
        <div class="nav-menu-item text-input">
            <label for="username"><?php echo lang('user_username');?></label>
            <input type="text" name="username" id="username" value="<?php echo set_value('username'); ?>"/>
            <?php echo form_error('username'); ?>
        </div>
        <div class="nav-menu-item text-input">
            <label for="password"><?php echo lang('user_password');?></label>
            <input type="password" name="password" id="password" />
            <?php echo form_error('password'); ?>
        </div>
        <label for="staylogged" class="nav-menu-item check-input">
            <input type="checkbox" name="staylogged" id="staylogged">
            <?php echo lang('user_staylogged');?>
        </label>
        <div class="submit-wrapper">
            <input class="nav-menu-item no-event submit-button" type="submit" value="<?php echo lang('user_login_go');?>" />
        </div>
    </form>
</div>

<script type="text/javascript">
    rkt.addPage('v-login');
</script>