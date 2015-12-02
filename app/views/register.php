<div class="page-content v-register">
    <h1><?php echo lang('user_register');?></h1>
    <?php echo form_open('user/register', array('class' => 'register-form')); ?>
        <div class="nav-menu-item text-input">
            <label for="username"><?php echo lang('user_username');?></label>
            <input type="text" name="username" id="username" value="<?php echo set_value('username'); ?>"></input>
            <?php echo form_error('username'); ?>
        </div>
        <div class="nav-menu-item text-input">
            <label for="email"><?php echo lang('user_email');?></label>
            <input type="text" name="email" id="email" value="<?php echo set_value('email'); ?>"></input>
            <?php echo form_error('email'); ?>
        </div>
        <div class="nav-menu-item text-input">
            <label for="password"><?php echo lang('user_password');?></label>
            <input type="password" name="password" id="password"></input>
            <?php echo form_error('password'); ?>
        </div>
        <div class="nav-menu-item text-input">
            <label for="password_conf"><?php echo lang('user_repeat_pwd');?></label>
            <input type="password" name="password_conf" id="password_conf"></input>
            <?php echo form_error('password_conf'); ?>
        </div>
        <div class="submit-wrapper">
            <input class="nav-menu-item submit-button" type="submit" value="<?php echo lang('user_register_go');?>"></input>
        </div>
    </form>
</div>

<script type="text/javascript">
    rkt.addPage('v-register');
</script>