import "./../App.css";
function FlipCard({ Front, Back }) {
  return (
    <div class="card ">
      <div class="content">
        <div class="front">{Front}</div>
        <div class="back">{Back}</div>
      </div>
    </div>
  );
}

export default FlipCard;
