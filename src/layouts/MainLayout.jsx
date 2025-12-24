import { useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ValidationBanner from '../components/ValidationBanner';
import './MainLayout.css';

const pageVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1
  },
  exit: {
    opacity: 0,
    x: '-50px'
  }
};

const pageTransition = {
  duration: 0.25,
  ease: [0.4, 0, 0.2, 1]
};

const MainLayout = () => {
  const location = useLocation();
  const currentOutlet = useOutlet();

  return (
    <div className="container">
      <ValidationBanner />
      <Sidebar />
      <div className="main-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className="animated-page-wrapper"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              overflowY: 'auto'
            }}
          >
            {currentOutlet}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainLayout;
