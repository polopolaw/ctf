package omctf2020ad.underpost.auth;

import java.util.HashMap;

public class SaltStorage {
    private static final Object syncObj = new Object();
    private static HashMap<String, String> saltMap = new HashMap<>();

    public static void add(String username, String salt){
        synchronized (syncObj) {
            saltMap.put(username, salt);
        }
    }

    public static String getSalt(String username){
        synchronized(syncObj){
            return saltMap.getOrDefault(username, null);
        }
    }
}
