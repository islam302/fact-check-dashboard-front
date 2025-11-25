import { useState, useEffect } from 'react';
import './FactCheckTable.css';

const FactCheckTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://fact-check-api-32dx.onrender.com/dashboard/fact-checks/');

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const getCaseClass = (caseValue) => {
    switch (caseValue) {
      case 'حقيقي':
        return 'case-true';
      case 'غير مؤكد':
        return 'case-uncertain';
      case 'زائف':
        return 'case-false';
      default:
        return '';
    }
  };

  const getCaseIcon = (caseValue) => {
    switch (caseValue) {
      case 'حقيقي':
        return '✓';
      case 'غير مؤكد':
        return '?';
      case 'زائف':
        return '✗';
      default:
        return '';
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="error-container">
        <p>حدث خطأ: {error}</p>
        <button onClick={fetchData} className="retry-button">إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div className="fact-check-container">
      <div className="header">
        <h1>🔍 لوحة التحقق من الحقائق</h1>
        <p className="subtitle">التحقق من صحة المعلومات بالذكاء الاصطناعي</p>
        {error && (
          <div className="warning-banner">
            <span>⚠️ تم تحميل البيانات التجريبية - {error}</span>
          </div>
        )}
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{data.length}</div>
          <div className="stat-label">إجمالي الاستعلامات</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.filter(item => item.case === 'حقيقي').length}</div>
          <div className="stat-label">حقيقي</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.filter(item => item.case === 'غير مؤكد').length}</div>
          <div className="stat-label">غير مؤكد</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.filter(item => item.case === 'زائف').length}</div>
          <div className="stat-label">زائف</div>
        </div>
      </div>

      <div className="table-container">
        <table className="fact-check-table">
          <thead>
            <tr>
              <th>#</th>
              <th>الاستعلام</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <>
                <tr key={item.id} className="table-row">
                  <td className="index-cell">{index + 1}</td>
                  <td className="query-cell">
                    <div className="query-preview">{item.query_preview}</div>
                  </td>
                  <td className="case-cell">
                    <span className={`case-badge ${getCaseClass(item.case)}`}>
                      <span className="case-icon">{getCaseIcon(item.case)}</span>
                      {item.case}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button
                      className="expand-button"
                      onClick={() => toggleRow(item.id)}
                    >
                      {expandedRow === item.id ? '▲ إخفاء' : '▼ عرض التفاصيل'}
                    </button>
                  </td>
                </tr>
                {expandedRow === item.id && (
                  <tr className="expanded-row">
                    <td colSpan="4">
                      <div className="talk-content">
                        <h4>📝 التحليل التفصيلي:</h4>
                        <p>{item.talk}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={fetchData} className="refresh-button">
        🔄 تحديث البيانات
      </button>
    </div>
  );
};

export default FactCheckTable;
