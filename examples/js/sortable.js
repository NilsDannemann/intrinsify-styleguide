function initSortable() {
    const workList = document.getElementById('workList');
    const healthList = document.getElementById('healthList');

    const sortableOptions = {
        animation: 150,
        filter: '.checked',
        delay: 250,
        delayOnTouchOnly: true,
        onEnd: function(evt) {
            // Update positions after sorting
            Array.from(evt.target.children).forEach((li, index) => {
                li.dataset.position = index;
            });
            saveToLocalStorage();
        },
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        chosenClass: 'sortable-chosen'
    };

    Sortable.create(workList, sortableOptions);
    Sortable.create(healthList, sortableOptions);
}