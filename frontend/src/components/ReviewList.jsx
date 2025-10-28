function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p className="no-reviews">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวร้านนี้!</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="review-list">
      <h3>รีวิวทั้งหมด ({reviews.length})</h3>
      {reviews.map(review => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <span className="reviewer-name">{review.userName}</span>
            <span className="review-rating">
              {'⭐'.repeat(review.rating)}
            </span>
          </div>
          <p className="review-comment">{review.comment}</p>
          <p className="review-date">
            วันที่เข้าร้าน: {formatDate(review.visitDate)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;