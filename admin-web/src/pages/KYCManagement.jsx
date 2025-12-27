import { useEffect, useState } from 'react';
import { Check, X, Eye, FileText, Calendar, AlertCircle, User, MapPin } from 'lucide-react';
import api from '../services/api';

export default function KYCManagement() {
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('submitted');
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchKYCSubmissions();
  }, [filter]);

  const fetchKYCSubmissions = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/kyc?status=${filter}`);
      setKycSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Failed to fetch KYC submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.post('/kyc/approve', { userId });
      fetchKYCSubmissions();
      alert('KYC approved successfully');
    } catch (error) {
      alert('Failed to approve KYC');
    }
  };

  const handleReject = async (userId) => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      await api.post('/kyc/reject', { userId, reason: rejectReason });
      fetchKYCSubmissions();
      setModalOpen(false);
      setRejectReason('');
      setSelectedKyc(null);
      alert('KYC rejected successfully');
    } catch (error) {
      alert('Failed to reject KYC');
    }
  };

  const openRejectModal = (kyc) => {
    setSelectedKyc(kyc);
    setModalOpen(true);
  };

  const viewDocument = (imageData) => {
    const newWindow = window.open();
    newWindow.document.write(`<img src="${imageData}" alt="ID Document" style="max-width: 100%; height: auto;" />`);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
      submitted: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
      approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    };
    const style = styles[status];
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${style.bg} ${style.text}`}>
        <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
        {status.toUpperCase()}
      </span>
    );
  };

  const filterOptions = [
    { value: 'submitted', label: 'Pending Review', count: kycSubmissions.length },
    { value: 'approved', label: 'Approved', count: 0 },
    { value: 'rejected', label: 'Rejected', count: 0 },
    { value: 'pending', label: 'Not Submitted', count: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">KYC Management</h1>
        <p className="text-slate-500 mt-1">Review and verify rider identity documents</p>
      </div>

      <div className="bg-white rounded-2xl p-2 border border-slate-200 inline-flex gap-1">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              filter === option.value
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : kycSubmissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No submissions found</h3>
          <p className="text-slate-500">No KYC submissions with status: {filter}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {kycSubmissions.map((submission) => (
            <div key={submission._id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {submission.kyc.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{submission.kyc.fullName}</h3>
                    <p className="text-slate-500 mt-1">{submission.phone}</p>
                  </div>
                </div>
                {getStatusBadge(submission.kyc.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <FileText size={20} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">ID Type</p>
                    <p className="text-slate-800 font-semibold">{submission.kyc.idType?.replace('_', ' ').toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <FileText size={20} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">ID Number</p>
                    <p className="text-slate-800 font-semibold">{submission.kyc.idNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Calendar size={20} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Date of Birth</p>
                    <p className="text-slate-800 font-semibold">{new Date(submission.kyc.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Calendar size={20} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Submitted</p>
                    <p className="text-slate-800 font-semibold">{new Date(submission.kyc.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium mb-1">Address</p>
                    <p className="text-slate-800">{submission.kyc.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => viewDocument(submission.kyc.idFrontImage)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-all font-medium border border-slate-200"
                >
                  <Eye size={18} />
                  View Front ID
                </button>
                {submission.kyc.idBackImage && (
                  <button
                    onClick={() => viewDocument(submission.kyc.idBackImage)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-all font-medium border border-slate-200"
                  >
                    <Eye size={18} />
                    View Back ID
                  </button>
                )}
              </div>

              {submission.kyc.status === 'submitted' && (
                <div className="flex gap-3 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => handleApprove(submission._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-semibold"
                  >
                    <Check size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => openRejectModal(submission)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all font-semibold"
                  >
                    <X size={18} />
                    Reject
                  </button>
                </div>
              )}

              {submission.kyc.status === 'rejected' && submission.kyc.rejectionReason && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm font-semibold text-red-900 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{submission.kyc.rejectionReason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Reject KYC Submission</h3>
            <p className="text-slate-600 mb-6">
              Please provide a reason for rejecting <span className="font-semibold">{selectedKyc?.kyc.fullName}</span>'s KYC submission:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-slate-50"
              rows="4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleReject(selectedKyc._id)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all font-semibold"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setRejectReason('');
                  setSelectedKyc(null);
                }}
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl hover:bg-slate-200 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
