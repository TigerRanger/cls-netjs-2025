import React, { useState, useRef, useEffect } from 'react';
import '@/sass/CollapsibleContent.scss';

const CollapsibleContent = () => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsCollapse, setNeedsCollapse] = useState(false);

  useEffect(() => {
    if (contentRef.current && contentRef.current.scrollHeight > 100) {
      setNeedsCollapse(true);
    }
  }, []);

  return (
    <div>
      <div
        ref={contentRef}
        className={`collapsible-container ${expanded ? 'expanded' : ''}`}
      >
        <ul>
          <li>Linkworld VC-13M07, grau (ES-CLSE006)</li>
          <li>Intel Core i3-12100, 4x 3.30 GHz (ES-PCS7143940)</li>
          <li>Intel Laminar RM1, 65W (ES-CLSE019)</li>
          <li>GIGABYTE H610M K DDR4 (ES-PCS8184101)</li>
          <li>16 GB DDR4-RAM, 3200 MHz, Markenspeicher | 2x 8GB (ES-PCS6424084)</li>
          <li>Grafik onBoard (ES-CLSE020)</li>
          <li>1 TB M.2 Solid State Drive (SSD) (ES-CLSE9007)</li>
          <li>450W Linkworld LPW19-25, 120mm Lüfter (ES-PCS3488856)</li>
          <li>on Board Sound (ES-CLSE030)</li>
          <li>Windows 11 Professional 64-Bit (ES-CLSE053)</li>
          <li>Professioneller Zusammenbau, Betriebssystem-Installation mit neusten Updates und Treibern, BIOS-Aktualisierung und 24-Stunden Funktions- und Stresstest (ES-CLSE029)</li>
          <li>3 Jahre Garantie und lebenslanger Service | inkl. Pick-Up & Return (ES-CLSE028)</li>
        </ul>
        {!expanded && needsCollapse && <div className="fade-out" />}
      </div>

      {needsCollapse && (
        <button className="collapse-toggle" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Weniger anzeigen ▲' : 'Mehr anzeigen ▼'}
        </button>
      )}
    </div>
  );
};

export default CollapsibleContent;
