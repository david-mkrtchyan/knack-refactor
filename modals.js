var modal =  (function () {
    let jsUcfirst = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    let initModal = function (modalTitle = 'Title') {
        $('#modal-cm').remove();
        let modal = document.createElement('div');
        modal.setAttribute('id', 'modal-cm');
        modal.classList.add('modal-cm');
        let modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container-cm');
        let modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header-cm');
        modalHeader.innerText = modalTitle || 'Title';
        let modalContent = document.createElement('div');
        modalContent.classList.add('modal-content-cm');
        let closeIcon = document.createElement('span');
        closeIcon.classList.add('close-cm');

        modalContainer.appendChild(closeIcon);
        modalContainer.appendChild(modalHeader);
        modalContainer.appendChild(modalContent);
        modal.appendChild(modalContainer);
        document.body.classList.add('overflow-hidden');
        document.body.appendChild(modal);

        closeModal = () => {
            modal.parentElement.removeChild(modal);
            document.body.classList.remove('overflow-hidden');
        };

        closeIcon.onclick = () => closeModal();

        window.onclick = function(event) {
            if (event.target === modal) {
                document.body.classList.remove('overflow-hidden');
                modal.parentElement.removeChild(modal);
            }
        };
    };

    let formModal = function (items, fieldType, modalTitle, patchValueTo) {
        initModal(modalTitle);
        items.forEach(function(item, index) {
            let label = document.createElement( 'label');
            label.classList.add('radio-label');

            let input = document.createElement("input");
            input.setAttribute('type',"radio");
            input.setAttribute('name', 'radio');

            //Marks the first item in modal as selected & checked
            index || input.setAttribute('checked', 'checked');

            let span = document.createElement('span');
            span.classList.add('checkmark');

            label.innerText = item;
            label.appendChild(input);
            label.appendChild(span);

            label.onclick = function(event) {
                setTimeout(() => {
                    $(patchValueTo).val(item);
                    document.body.classList.remove('overflow-hidden');
                    $( "#modal-cm" ).remove();
                }, 300)
            };

            $('#modal-cm .modal-content-cm').append( label );
        })
    };

    let infoModal = function (items, modalTitle, message){
        initModal(modalTitle);
        //in the case if we just whanat to show a simple message without key => value
        if (message && !items.length) {
            let div = document.createElement('div');
            div.classList.add('info-row');

            let info = document.createElement('span');
            info.innerText = message;
            div.appendChild(info);
            $('#modal-cm .modal-content-cm').append(div);
            return;
        }

        items.forEach(item => {
            let div = document.createElement('div');
            div.classList.add('info-row');

            let title = document.createElement('span');
            let info = document.createElement('span');
            title.innerText = jsUcfirst(item.displayName) + ': ';
            info.innerText = item.value;

            div.appendChild(title);
            div.appendChild(info);

            $('#modal-cm .modal-content-cm').append(div);
        })
    };

    return {
        jsUcfirst,
        initModal,
        formModal,
        infoModal
    }
})();