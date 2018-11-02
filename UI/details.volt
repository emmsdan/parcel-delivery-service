
        <form method="" action="#">
          <div class="content-box parcel no-border">
            <h5>Order Details</h5>
            <div class="map">

            </div>
            <table class="form">
              <tr>
                <th>Content</th> <td> 1 Iphone 6+, 2 HP laptops </td>
              </tr>
              <tr>
                <th>Pick Up</th>
                <td>
                  Ikeja, GRA, No. 120, Lagos
                  <br /> 24354
                </td>
              </tr>
              <tr>
                <th>Destination</th>
                <td>
                  No. 258, Lokoja, Kogi State
                  <br /> 24354
                </td>
              </tr>
              <tr>
                <th>Current Location</th>
                <td> <input value="in transit"> </td>
              </tr>
              <tr>
                <th>Weight</th> <td> 20kg </td>
              </tr>
              <tr>
                <th>Approx. Distance</th> <td> 258miles </td>
              </tr>
              <tr>
                <th>Approx. Duration</th> <td> 4hr 20min </td>
              </tr>
              <tr>
                <th>Approx. Price</th> <td> <strong><del>N</del>2, 000</strong> </td>
              </tr>
              <tr>
                <th class="">Status</th>
                <th class="red">
                  <select onchange="toast(this.value)">
                    <option>Delivered</option>
                    <option selected>Pending</option>
                    <option> Canceled </option>
                  </select>
              </tr>
            </table>
          </div>
        </form>