import * as M from 'materialize-css';

const MaterialService = () => {

    const toast = (message) => {
        M.toast({ html: message });
    };

    const initializeFloatingButton = (elemRef) => {
        if (elemRef.current) {
            M.FloatingActionButton.init(elemRef.current);
        }
    };

    const updateTextInput = () => {
        M.updateTextFields();
    };

    const initModal = (elemRef) => {
        if (elemRef.current) {
            return M.Modal.init(elemRef.current);
        }
        return null;
    };

    const initTooltip = (elemRef) => {
        if (elemRef.current) {
            return M.Tooltip.init(elemRef.current);
        }
        return null;
    };

    const initDatePicker = (elemRef, onClose) => {
        if (elemRef.current) {
            const options = {
                format: 'dd.mm.yyyy',
                showClearBtn: true,
                onClose,
            };
            return M.Datepicker.init(elemRef.current, options);
        }
        return null;
    };

    const initTapTarget = (elemRef) => {
        if (elemRef.current) {
            return M.TapTarget.init(elemRef.current);
        }
        return null;
    };

    return {
        toast,
        initializeFloatingButton,
        updateTextInput,
        initModal,
        initTooltip,
        initDatePicker,
        initTapTarget,
        M,
    }

}

export default MaterialService();
