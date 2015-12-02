<div class="page-content v-settings">
    <div class="settings-block">
        <h1>Settings</h1>
        <h2>Audio &amp; Graphics settings:</h2>
        <div class="nav-menu-item slider-option">
            <div class="caption">Desired FPS:</div>
            <div class="settings-input" id="fps-op"></div>
        </div>
        <div class="nav-menu-item slider-option">
            <div class="caption">Video Delay:</div>
            <div class="settings-input" id="vdelay-op"></div>
        </div>
        <div class="nav-menu-item slider-option">
            <div class="caption">Global Volume:</div>
            <div class="settings-input" id="global-volume-op"></div>
        </div>
        <div class="nav-menu-item slider-option">
            <div class="caption">Sound Effects Volume:</div>
            <div class="settings-input" id="sfx-volume-op"></div>
        </div>
        <h2>Input settings:</h2>
        <div class="nav-menu-item yesno-option">
            <div class="caption">Ignore unused keys:</div>
            <div class="settings-input" id="ignore-input-op">
                <input class="number-input nodisplay" type="text" value=""></input>
                <div class="yesno">
                    <a href="#" title="Yes" class="yes">Yes</a>
                    <a href="#" title="No" class="no">No</a>
                </div>
            </div>
        </div>
        <div class="nav-menu-item kblayout-option">
            <div class="caption">Keyboard layout:</div>
            <div class="settings-input" id="kb-layout-op">
                <input class="number-input nodisplay" type="text" value=""></input>
                <div class="kb-choice">
                    <img src="<? echo base_url('assets/img/kb_layout_1.png') ?>" alt="Qwerty On-surface Keyboard" />
                </div>
                <div class="kb-choice">
                    <img src="<? echo base_url('assets/img/kb_layout_2.png') ?>" alt="Qwerty Inverted Keyboard" title="Qwerty Inverted Keyboard" />
                </div>
                <div class="kb-choice">
                    <img src="<? echo base_url('assets/img/kb_layout_3.png') ?>" alt="Numbers Inverted Keyboard (may not work with Azerty and Co)" title="Numbers Inverted Keyboard (may not work with Azerty and Co)" />
                </div>
                <div class="kb-choice">
                    <img src="<? echo base_url('assets/img/kb_layout_4.png') ?>" alt="Function Keys Inverted Keyboard" title="Function Keys Inverted Keyboard" />
                </div>
                <div class="ninja">
                    <img src="<? echo base_url('assets/img/kb_layout_1.png') ?>" alt="Function Keys Inverted Keyboard" />
                </div>
                <div class="kb-nav clear">
                    <a href="#" class="p">Prev</a> | <a href="#" class="n">Next</a>
                </div>
            </div>
        </div>
        <h2><!-- Saving --></h2>
        <a href="#" class="settings-save nav-menu-item">Save Settings</a>
        <a href="#" class="settings-reset nav-menu-item">Set to Default</a>
    </div>
</div>

<script type="text/javascript">
    rkt.addPage('v-settings');
</script>