import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";

module {
  type Pledge = {
    certificateId : Text;
    timestamp : Time.Time;
    name : Text;
    email : Text;
  };

  type OldActor = {
    pledgesMap : Map.Map<Text, Pledge>;
    counter : Nat;
  };

  type NewActor = {
    pledgesMap : Map.Map<Text, Pledge>;
    counter : Nat;
    adminPassword : Text;
  };

  public func run(old : OldActor) : NewActor {
    { old with adminPassword = "ldorado2017admin" };
  };
};
