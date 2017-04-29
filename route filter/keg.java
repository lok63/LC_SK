package main.java.it.isislab;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.ListIterator;

public class RoutesFinder {

	private List<String> dataList;
	private String previous = "";
	private String current = "";
	private final FastTokenizer fastTokCurr = new FastTokenizer();
	private final FastTokenizer fastTokPrev = new FastTokenizer();
	private String dds;
	private String event;
	String prevTimestampString = "";
	String currTimestampString = "";
	//Specify the desired pattern using the Date Class
	SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
	Date prevDate = null;
	Date currDate = null;
	int prevDay = 0;
	int currDay = 0;
	private long minutes = 0;
	private long hours = 0;

	public RoutesFinder(List<String> myList) {
		dataList = myList;
	}

	/**
	 * This method calculates routes for a particular UnitNumber.
	 * @return dataList - list of routes for a particular UnitNumber
	 */
	public List<String> getRoutes() {

        // just return if list is empty
		// we should not have exceptions any more for unit number without data
        // 12/05/2016 - Johnis
        if(dataList == null || dataList.size() == 0 || dataList.size() == 1)
        {
        	dataList = Collections.emptyList();
        	return dataList;
        }

		ListIterator<String> it = dataList.listIterator();

//******************************************************************************
//********************* Checks first row  *****************************

		// Check if the first row is empty or contains useless characters.
		String checkFirst = it.next();
		if(checkFirst.length() < 5) {
			it.remove();
		}
		else {
			it.previous();
		}

		while(it.hasNext()) {
			// The pointer of the iterator lies between the element that is returned by a call to next()
			// or previous().
			current = it.next();

			fastTokPrev.tokenize(previous, ',');
			fastTokCurr.tokenize(current, ',');

//******************************************************************************
//********************* add the data to our list *****************************

			if(!previous.equals("")) { //checks if its not empty
				// extracts timestamp, dds, event information from previous and current rows.
				prevTimestampString = fastTokPrev.tokens[1];
				currTimestampString = fastTokCurr.tokens[1];
				dds = fastTokCurr.tokens[15];
				event = fastTokCurr.tokens[2];

				// parses timestamps from String format to Date format
				// in order to use the .getTime() function.
				//.getTime() returns the number of milliseconds
				try {
					prevDate = format.parse(prevTimestampString);
					currDate = format.parse(currTimestampString);
				} catch(ParseException e) {
					e.printStackTrace();
				}

				// calculates the difference between previous and current timestamp.
				long gapTime = Math.abs(currDate.getTime() - prevDate.getTime());
				// extracts minutes and hours from the time difference calculated above.
				minutes = (gapTime / (60 * 1000)) % 60;
				hours = (gapTime/(60 * 60 * 1000)) % 24;

//********************* Extract the day  *****************************
				// creates the Calendar object in order to extract the day from the date.
				Calendar cal = Calendar.getInstance();
				cal.setTime(prevDate);
				prevDay = cal.get(Calendar.DAY_OF_MONTH);
				cal.setTime(currDate);
				currDay = cal.get(Calendar.DAY_OF_MONTH);
			}

//********************* Destination  *****************************
			// If the train is starting from a "non-depot station" but it is arriving to
			// a "depot station" removes the first row; otherwise labels the first row as "FIRST".
			if((current.contains("START")) && (previous.equals(""))
					&& (!current.contains("Sidings")
							&& !current.contains("Depot")
							&& !current.contains("Shed"))) {

				if(it.hasNext()) {//md bug fixing
				String nextStation = it.next();
					if(nextStation.contains("Sidings")
						|| nextStation.contains("Depot")
						|| nextStation.contains("Shed")) {
					it.previous();
					it.previous();
					it.remove();
					}
					else {
					it.previous();
					it.previous();
					it.set(current+","+"FIRST");
					}
				}
			}

			// If the train comes from Brixto, or Bromley South or Denmark Hill and stops to Victoria Sidings,
			// just remove the rows that contain Victoria Sidings, because it is not part of the route and it is
			// not the terminal station.

			else if((current.contains("Brixton") || current.contains("Bromley South") || current.contains("Denmark"))
					&& current.contains("START") && it.hasNext()) {
				if(it.next().contains("Victoria Sidings")) {
						it.remove();
						while(it.next().contains("Victoria Sidings")) {
							it.remove();
						}
						it.previous();
				}
				else {
					it.previous();
				}
				//sh1.trigger(red)
			}

			// Removes Slate Green Depot rows when the previous read station is Slade Green.
			else if(fastTokCurr.tokens[3].equals("Slade Green") && current.contains("START")) {
				String checkDepot = "";
				if(it.hasNext()) {
					checkDepot = it.next();
					if(checkDepot.contains("Slade Green Depot")) {
						it.remove();
						while(it.hasNext() && it.next().contains("Slade Green Depot")) {
							it.remove();
						}
						it.previous();
					}
					else {
						it.previous();
					}
				}
			}

			//*********************** elseif 3 ********************************************
			// When a train starts from a "non-depot station" and stops to a "depot station",
			// assigns the label "LAST" to the "non-depot station" row that contains the STOP event
			// and deletes the subsequent rows.
			else if((current.contains("Sidings")
					|| current.contains("Depot")
					|| current.contains("Shed")) && (previous.contains("START"))
					&& ((!previous.contains("Sidings")
							&& !previous.contains("Depot")
							&& !previous.contains("Shed")))) {

				it.previous();
				if(it.hasPrevious()) {
					it.previous();

					String lastStationStop = (it.hasPrevious()) ? it.previous() : "";
					if(!lastStationStop.contains("LAST") && lastStationStop != "" && !lastStationStop.isEmpty()) {
						it.set(lastStationStop+","+"LAST");
					}
					it.next();
					it.next();
					it.remove();
					if(it.hasNext())
					{
						it.next();
						it.remove();
					}
				}
				else {
					it.remove();
				}
			}

			// Removes the rows that contain Sidings, Depot or Shed.
			else if(current.contains("Sidings")
					|| current.contains("Depot")
					|| current.contains("Shed")) {
				it.remove();
			}

			// When a train starts and stops into the same station, remove the corresponding rows
			// and labels the previous available row as the last and the next available station as
			// the first.
			else if((!previous.equals(""))
					&& (fastTokPrev.tokens[3].equals(fastTokCurr.tokens[3])
					&& (fastTokPrev.tokens[2].equals("START"))
					&& (fastTokCurr.tokens[2].equals("STOP")))) {
				it.previous();
				it.previous();

				if(it.hasPrevious()) {
					String prevCheck = it.previous();
					if(!prevCheck.contains("LAST")) {
						it.set(prevCheck+","+"LAST");
					}
					it.next();
				}

				it.next();
				it.remove();
				it.next();
				it.remove();

				if(it.hasNext()) {
					it.set(it.next()+","+"FIRST");
					it.previous();
				}
			}

			// When a train starts from a "depot station" and stops to a "non-depot station"
			// removes the "non-depot station" with the STOP event and labels the next available
			// station as the first.
			else if((previous.contains("Sidings")
					|| previous.contains("Depot")
					|| previous.contains("Shed")) && (current.contains("STOP"))) {
						it.remove();
				if(it.hasNext())
				{
					current = it.next();
					it.set(current+","+"FIRST");
				}
			}

			// excludes Dartford -> Crayford sequence from the computation.
			else if(fastTokCurr.tokens[3].equals("Dartford")
					&& fastTokPrev.tokens[2].equals("START")) {
				if(it.hasNext()) {
					if(it.next().contains("Crayford")) {
						System.out.println("did nothing");
					}
					it.previous();
				}
			}

			// Sequence Slade Green, Erith
			else if(fastTokCurr.tokens[3].equals("Erith") && fastTokPrev.tokens[3].equals("Slade Green")) {
				int i;
				String checkOutward = "";
				for(i = 0; i < 4; i++) {
					if(it.hasPrevious()) {
						checkOutward = it.previous();
					}
					else
						break;
				}
				if(i == 4) {
					if(!checkOutward.contains("Dartford") && (!checkOutward.contains("Crayford"))) { // ADDED by IA (second condition) 15/06/2016 as discussed with MD
						it.next();
						String lastCheck = it.next();
						if(!lastCheck.contains("LAST")) {
							it.set(lastCheck+","+"LAST");
						}
						String nextCheck = it.next();
						if(!nextCheck.contains("FIRST")) {
							it.set(nextCheck+","+"FIRST");
						}
						it.next();
					}
					else {
						for(int j = 0; j < 4; j++) {
							it.next();
						}
					}
				}
				else {
					for(int j = 0; j < i; j++) {
						it.next();
					}
				}

			}

			// Removes LAST and FIRST labels when the sequence of stops corresponds to
			// Dartford -> Crayford OR Deptford -> Greenwich
			// Hither green ->Lee or Waterloo East and reverse

			else if(//(current.contains("Crayford") && previous.contains("Dartford"))||  commented by LB 14/07/16
					 (current.contains("Greenwich") && previous.contains("Deptford"))||
					 ((current.contains("Lee") || current.contains("Waterloo East"))
							 && previous.contains("Hither Green")))
						{

				it.previous();
				it.previous();

				String lastCheck;

				if(it.hasPrevious()){
				lastCheck = it.previous();


				if(lastCheck.contains("LAST")) {
					it.set(lastCheck.substring(0, lastCheck.length()-4));
				}
				}

				it.next();
				String nextCheck = it.next();
				if(nextCheck.contains("FIRST")) {
					it.set(nextCheck.substring(0, nextCheck.length()-5));
				}
				it.next();
			}

			// Removes the rows from the dataset when the sequence of stops corresponds to
			// Bellingham -> Orpington
			else if(current.contains("Bellingham")) {
				String nextCheck = it.next();
				if(nextCheck.contains("Orpington") && nextCheck.contains("STOP")) {
					it.previous();
					it.remove();
					it.previous();
					it.remove();
					String setFirst = it.next();
					if(!setFirst.contains("FIRST")) {
						it.set(setFirst+","+"FIRST");
					}
				}
				else {
					it.previous();
				}
			}

			// If the train is stopped for more than 4 minutes, labels the last visited stations as
			// the LAST and the FIRST of a route.
			else if((!previous.equals(""))
					&& (fastTokPrev.tokens[3].equals(fastTokCurr.tokens[3]))
					&& (minutes >= 4 || (hours >= 1))//added by LB, bug fixing, 07_07_2016
					&& (fastTokPrev.tokens[2].equals("STOP"))
					&& (fastTokCurr.tokens[2].equals("START"))
					&& (!fastTokCurr.tokens[3].contains("Barnehurst"))
					&& (!fastTokCurr.tokens[3].contains("Blackheath")) //added by LB 24/07/2016
					&& (!fastTokCurr.tokens[3].contains("Waterloo East")) //added later
					&& (!fastTokCurr.tokens[3].contains("Sole Street")) //added later
					&& (!fastTokCurr.tokens[3].contains("Ashford International")) //added later md 20/06/2016
					&& (!fastTokCurr.tokens[3].contains("Faversham"))//added later md 20/06/2016
					//&& (!fastTokCurr.tokens[3].contains("Crayford"))//added later md 24/06/2016
					&& (!fastTokCurr.tokens[3].contains("Rochester"))
					&& (!fastTokCurr.tokens[3].contains("Chatham"))
					&& (!fastTokCurr.tokens[3].contains("Lewisham"))
					&& (!fastTokCurr.tokens[3].contains("Bridge"))
					&& !((fastTokCurr.tokens[3].contains("Dartford"))
							&&(fastTokPrev.tokens[3].contains("Stone Crossing"))))//md 20_07_2016
			{
				it.previous();
				if(it.hasPrevious()) {//added later
					String lastCheck = it.previous();
					if(!lastCheck.contains("LAST")) {
						it.set(lastCheck+","+"LAST");
					}
					it.next();
					String nextCheck = it.next();
					if(!nextCheck.contains("FIRST")) {
						it.set(nextCheck+","+"FIRST");
					}
				}
			}

			 // new else if condition md 20/07/2016

            else if(
                    ((fastTokCurr.tokens[3].equals("Barnehurst"))
                    && (fastTokPrev.tokens[3].equals("Slade Green")))
                    ||
                    ((fastTokCurr.tokens[3].equals("Crayford"))
                    && (fastTokPrev.tokens[3].equals("Barnehurst")))
                    ||
                    ((fastTokCurr.tokens[3].equals("Barnehurst"))
                    && (fastTokPrev.tokens[3].equals("Crayford")))
                            )
            {
                it.previous();
                String lastCheck = it.next();
                if(!lastCheck.contains("LAST")) {
                    it.set(lastCheck+","+"LAST");
                }
                String firstCheck = it.next();
                if(!firstCheck.contains("FIRST")) {
                    it.set(firstCheck+","+"FIRST");
                }
                it.previous();
            }

			else if(
				/*  ((fastTokCurr.tokens[3].equals("Barnehurst"))
					&& (fastTokPrev.tokens[3].equals("Slade Green")))

					|| ((fastTokCurr.tokens[3].equals("Crayford"))
						&&
//						((fastTokPrev.tokens[3].equals("Slade Green")) || COMMENTED BY IA 15/06/2016 as discussed with MD
						(fastTokPrev.tokens[3].equals("Barnehurst")))

					||  */ //commnets by md 20/06/2016
					((fastTokCurr.tokens[3].equals("London Victoria"))
							&& (fastTokPrev.tokens[3].equals("Hayes")))

					|| ((fastTokCurr.tokens[3].equals("Charing Cross"))
							&& (fastTokPrev.tokens[3].equals("Orpington")))

					|| ((fastTokCurr.tokens[3].equals("Orpington"))
							&& (fastTokPrev.tokens[3].equals("Charing Cross"))) //added 14/07/16 LB

					|| ((fastTokCurr.tokens[3].equals("Beckenham Junction Station"))
							&& (fastTokPrev.tokens[3].equals("London Victoria")))

					|| ((fastTokCurr.tokens[3].equals("Charing Cross"))
							&& (fastTokPrev.tokens[3].equals("Hayes")))

					|| ((fastTokCurr.tokens[3].equals("Hayes"))
							&& (fastTokPrev.tokens[3].equals("Charing Cross"))) //added 14/07/16 LB

					|| ((fastTokCurr.tokens[3].equals("Charing Cross"))
							&& (fastTokPrev.tokens[3].equals("Crayford"))) //added 14/07/16 LB

					|| ((fastTokCurr.tokens[3].equals("Ashford International"))
							&& (fastTokPrev.tokens[3].equals("Folkestone Central"))) //added 14/07/16 LB

					|| ((fastTokCurr.tokens[3].equals("Ashford International"))
							&& (fastTokPrev.tokens[3].equals("Canterbury West"))) //added 14/07/16 LB

					|| ((fastTokCurr.tokens[3].equals("Blackfriars"))
							&& (fastTokPrev.tokens[3].equals("Orpington")))

					|| ((fastTokCurr.tokens[3].equals("Tunbridge Wells"))
							&& (fastTokPrev.tokens[3].equals("London Cannon Street")))

					|| ((fastTokCurr.tokens[3].equals("Tunbridge Wells"))
							&& (fastTokPrev.tokens[3].equals("Charing Cross")))

							) {
				it.previous();
				it.previous();
				String lastCheck = "";
				if(it.hasPrevious())
					lastCheck = it.previous();
				if(!lastCheck.contains("LAST")) {
					it.set(lastCheck+","+"LAST");
				}
				it.next();
				it.next();
				it.remove();
				it.next();
				it.remove();

				if(it.hasNext()) {
				String firstCheck = it.next();
				if(!firstCheck.contains("FIRST")) {
					it.set(firstCheck+","+"FIRST");
				}
				it.previous();
				}
			}

			// if the route is composed of only two stations, and the time between them is more than
			// 20 minutes or more than a hour, removes the rows from the dataset.
			else if((!previous.equals(""))
					&& (!fastTokPrev.tokens[3].equals(fastTokCurr.tokens[3])
					&& (fastTokPrev.tokens[2].equals("START"))
					&& (fastTokCurr.tokens[2].equals("STOP"))
					&& ((minutes > 20) || (hours >= 1))
					&& ((fastTokCurr.tokens[3].contains("Bromley") && !fastTokPrev.tokens[3].contains("Victoria"))
							|| (fastTokCurr.tokens[3].contains("Victoria") && !fastTokPrev.tokens[3].contains("Bromley")))
					&& (fastTokCurr.tokens[3].contains("Victoria") && !fastTokPrev.tokens[3].contains("Rochester"))
					&& (fastTokCurr.tokens[3].contains("Victoria") && !fastTokPrev.tokens[3].contains("Mary"))

							)) {
				it.previous();
				it.previous();
				it.remove();
				it.next();
				it.remove();

			}

			// when the dds changes, that indicates the initiation of a new route.
			else if((!previous.equals("")) && (!fastTokPrev.tokens[15].equals(dds))
					&& (event.equals("STOP"))) {
				if(!current.contains("London")) {
					it.set(current+","+"LAST");
					if(it.hasNext())
						it.set(it.next()+","+"FIRST");
					it.previous();
				}
			}

			// when the dds changes, that indicates the initiation of a new route.
			else if((!previous.equals("")) && (!fastTokPrev.tokens[15].equals(dds))
					&& (event.equals("START"))) {
				it.previous();

				if(it.hasPrevious()) {
				String lastCheck = it.previous();
				if(!lastCheck.contains("LAST")) {
					it.set(previous+","+"LAST");
				}
				}
				it.next();
				String nextCheck = it.next();
				if(!nextCheck.contains("FIRST")) {
					it.set(current+","+"FIRST");
				}
			}

			// Removes Grove Park Down Sidings rows when the previous read station is Orpington.
			else if(fastTokCurr.tokens[3].equals("Orpington") && current.contains("START") && it.hasNext()) {
				if(it.next().contains("Grove Park Down Sidings")) {
					it.remove();
					while(it.next().contains("Grove Park Down Sidings")) {
						it.remove();
					}
					it.previous();
				}
				else {
					it.previous();
				}
			}

			// if a service is starting in a particular day of the week and it is stopping
			// on a following day, removes the rows and and labels the previous available row
			// as the last and the next available station as the first.
			//**********************************************************
			// *********************************************************
			// COMMENTED BY IA 15/06/2016 - as discussed with MD.
			// This smells here, we may have side effects !!!!!
			// I had already added some bug fixes here.
			// ************************************************
//			else if((prevDay != currDay) && (current.contains("STOP"))) {
//                it.previous();
//                it.previous();
//                if(it.hasPrevious()) {//added later
//                String prevCheck = it.previous();
//                if(!prevCheck.contains("LAST")) {
//                    it.set(prevCheck+","+"LAST");
//                }
//                }
//                it.next();
//                it.next();
//                it.remove();
//                it.next();
//                it.remove();
//                if(it.hasNext()) // added 18/05/2016 - Johnis since it was breaking
//                	it.set(it.next() + "," + "FIRST");
//                it.previous();
//            }

			// checks if the train is performing the same route in a reverse direction.
			else if((!previous.equals(""))) {
				int i;
				String checkOutward = "";
				for(i = 0; i < 4; i++) {
					if(it.hasPrevious()) {
						checkOutward = it.previous();
					}
					else
						break;
				}
				if(i == 4) {
					if(checkOutward.contains(fastTokCurr.tokens[3])) {
						if(checkOutward.contains("FIRST")) {
							it.next();
							it.remove();
							it.next();
							it.remove();
							it.next();
							it.next();
						}
						else {
							it.next();
							String checkOut = it.next();
							if(!checkOut.contains("LAST") && !checkOut.contains("FIRST")) {
								it.set(checkOut+","+"LAST");
							}
							else {
								it.set(checkOut);
							}

							String checkRet = it.next();
							if(!checkRet.contains("FIRST") && !checkOut.contains("FIRST")) {
								it.set(checkRet+","+"FIRST");
							}
							else {
								it.set(checkRet);
							}
							it.next();
						}
					}
					else {
						for(int j = 0; j < i; j++) {
							it.next();
						}
					}
				}
				else {
					for(int j = 0; j < i; j++) {0
						it.next();
					}
				}
			}
			previous = current;
		} //end while

		// checks if the second to last row is labeled with FIRST and removes it and also
		// removes the last row.

		if (dataList.size() > 3){
		String firstCheck = dataList.get(dataList.size()-3);

		if(firstCheck.contains("FIRST")) {
			dataList.remove(dataList.size()-1);
			dataList.remove(dataList.size()-1);
		}

		// checks if the last row is labeled with START and removes it.
		String lastStationCheck = dataList.get(dataList.size()-1);
		if(lastStationCheck.contains("START")) {
			dataList.remove(dataList.size()-1);
		}

		// checks if the last row is labeled as LAST; if not, assigns the LAST label.
		String newLastStation = dataList.get(dataList.size()-1);
		if(!newLastStation.contains("LAST")) {
			dataList.set(dataList.size()-1, newLastStation+","+"LAST");
		}
		else {
			dataList.set(dataList.size()-1, newLastStation);
		}
		}
		// the object returned at the end of the routes finder algorithm.
		return dataList;
	}

}
