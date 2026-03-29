package FitnessTracker.example.Project.service;


import FitnessTracker.example.Project.entity.Contact;
import java.util.List;

public interface ContactService {

    Contact save(Contact contact);

    List<Contact> getAll();

    Contact getById(String id);

    Contact update(String id, Contact contact);

    void delete(String id);

    List<Contact> getArchived();

    List<Contact> getActive();
}