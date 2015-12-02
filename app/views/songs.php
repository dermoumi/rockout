<?php if (count($entries) > 0): ?>

<?php if ($id != 'recent' && !$no_filters) : ?>
<div class="pl-filters">
    <a href="#" class="filter-toggle nav-menu-item">Filtering &amp; Order by</a><ul class="filter-optons closed">
        <li class="orderby">
            <span class="caption">Order by:</span>
            <select name="orderby" class="orderby">
                <option value="title">Title</option>
                <option value="artist">Artist</option>
                <option value="difficulty">Difficulty</option>
                <option value="duration">Duration</option>
                <option value="rating">Rating</option>
            </select>
            <select name="order" class="order">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </li>
        <li class="difficulty-filter">
            <span class="caption">Difficulties:</span>
            <label for="d-easy-<?php echo $id; ?>" class="difficulty">
                <input type="checkbox" value="easy" id="d-easy-<?php echo $id; ?>">
                Easy
            </label>
            <label for="d-medium-<?php echo $id; ?>" class="difficulty">
                <input type="checkbox" value="medium" id="d-medium-<?php echo $id; ?>">
                Medium
            </label>
            <label for="d-hard-<?php echo $id; ?>" class="difficulty">
                <input type="checkbox" value="hard" id="d-hard-<?php echo $id; ?>">
                Hard
            </label>
            <label for="d-extreme-<?php echo $id; ?>" class="difficulty">
                <input type="checkbox" value="extreme" id="d-extreme-<?php echo $id; ?>">
                Extreme
            </label>
        </li>
    </ul>
</div>
<?php endif; ?>

<div class="pl-songs">
    <?php foreach ($entries as $entry) : ?>
    <a class="pl-song slider nav-menu-item" href="<?php echo site_url('songs/show/' . $entry->id); ?>">
        <span class="difficulty medium">Medium</span>
        <span class="metadata">
            <span class="title"><?php echo $entry->title; ?></span>
            <span class="artist"><?php echo $entry->artist; ?></span>
        </span>
        <span class="rating rate-4">4/5</span>
    </a>
    <?php endforeach; ?>

    <?php if ($current_page < $page_count) : ?>
    <?php echo anchor('songs/show_list/'.$id.'/'.$sorting.'/'.$order.'/'.($current_page), 'Show more...', 'class="pl-more nav-menu-item"'); ?>
    <?php endif; ?>
</div>
<?php else: ?>
<div class="loading">No songs to show.</div>
<?php endif; ?>