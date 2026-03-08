import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Pledge = {
    certificateId : Text;
    timestamp : Time.Time;
    name : Text;
    email : Text;
  };

  type Certificate = {
    id : Text;
    name : Text;
    timestamp : Time.Time;
  };

  module Certificate {
    public func compare(cert1 : Certificate, cert2 : Certificate) : Order.Order {
      switch (Int.compare(cert2.timestamp, cert1.timestamp)) {
        case (#equal) { Text.compare(cert1.name, cert2.name) };
        case (order) { order };
      };
    };
  };

  let adminPassword = "ldorado2017admin";

  // certificateId to pledge
  let pledgesMap = Map.empty<Text, Pledge>();

  // limit recently displayed certificates
  let maxResponseLength = 100;

  /// Counter for certificateId solution.
  var counter : Nat = 0;

  public shared ({ caller }) func takePledge(name : Text, email : Text) : async Certificate {
    let emailLower = email.toLower();

    // ensure unique email address
    let hasEmail = pledgesMap.values().find(
      func(pledge) {
        pledge.email == emailLower;
      }
    );

    if (hasEmail != null) {
      Runtime.trap("This email has already taken the pledge.");
    };

    let certificateId = generateCertificateId();
    let pledge : Pledge = {
      certificateId;
      timestamp = Time.now();
      name;
      email = emailLower;
    };

    pledgesMap.add(certificateId, pledge);

    let certificate : Certificate = {
      id = certificateId;
      name;
      timestamp = pledge.timestamp;
    };

    certificate;
  };

  public query ({ caller }) func getTotalPledges() : async Nat {
    pledgesMap.size();
  };

  public query ({ caller }) func getRecentCertificates() : async [Certificate] {
    let certificatesIter = pledgesMap.values().map(
      func(pledge) {
        {
          id = pledge.certificateId;
          name = pledge.name;
          timestamp = pledge.timestamp;
        };
      }
    );
    let sortedCertificates = certificatesIter.toArray().sort();
    let limitedCertificates = Array.tabulate(
      if (sortedCertificates.size() < maxResponseLength) {
        sortedCertificates.size();
      } else {
        maxResponseLength;
      },
      func(i) { sortedCertificates[i] },
    );
    limitedCertificates;
  };

  public query ({ caller }) func getAdminPledges(password : Text) : async [Pledge] {
    if (password != adminPassword) { Runtime.trap("Unauthorized") };
    pledgesMap.values().toArray();
  };

  func generateCertificateId() : Text {
    // generate certificateId without timestamp, use counter instead (persistent on upgrade)
    counter += 1;
    counter.toText();
  };
};
