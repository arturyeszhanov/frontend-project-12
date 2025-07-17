import { useSelector, useDispatch } from 'react-redux'
import { Modal } from 'react-bootstrap'
import getModal from './index.js'
import { closeModal } from '../../slices/modalSlice.js'

const ModalFacade = () => {
    const modal = useSelector(state => state.modal)
    console.log('modal', modal)
    console.log('modal.type', modal.type)
    console.log('getModal(modal.type)', getModal(modal.type))
    const CurrentModal = getModal(modal.type)
    const dispatch = useDispatch()
  
    return (
      <Modal show={modal.active} onHide={() => dispatch(closeModal())}>
        {CurrentModal ? <CurrentModal /> : null}
      </Modal>
    )
  }

export default ModalFacade
